/*-----------------------------------------------------------------------------------------*\
 |  The MIT License (MIT)                                                                    |
 |                                                                                           |
 |  Copyright (c) 2015 PayPal                                                                |
 |                                                                                           |
 |  Permission is hereby granted, free of charge, to any person obtaining a copy             |
 |  of this software and associated documentation files (the 'Software'), to deal            |
 |  in the Software without restriction, including without limitation the rights             |
 |  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                |
 |  copies of the Software, and to permit persons to whom the Software is                    |
 |  furnished to do so, subject to the following conditions:                                 |
 |                                                                                           |
 |      The above copyright notice and this permission notice shall be included in           |
 |  all copies or substantial portions of the Software.                                      |
 |                                                                                           |
 |      THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR           |
 |  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,                 |
 |      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE          |
 |  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                   |
 |  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,            |
 |      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN            |
 |  THE SOFTWARE.                                                                            |
 \*---------------------------------------------------------------------------------------- */

/*
 data: {
 name: test-name,
 cucumber_tags: scenarios.getTags(),
 tags: array of tags
 passed: true/false,
 build: build_id,
 'custom-data': {error: 'cause of failure}}
 */

'use strict';

const defaults = require('lodash.defaults');
const request = require('requestretry');
const debug = require('debug');
const log = debug('nemo-saucelabs:log');

const DEFAULTS = {
  host: 'https://saucelabs.com',
  base: 'rest/v1',
  json: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

function SauceLabs(options) {
  if (options.username === undefined || options.accessKey === undefined) {
    throw new Error('Sauce Labs username and/or accessKey is undefined. Please specify through config.');
  }

  this.options = defaults({}, DEFAULTS, options);
};

SauceLabs.prototype.updateJob = function(data) {
  const { cucumber_tags: cucumberTags } = data;
  if (cucumberTags && Array.isArray(cucumberTags)) {
    const tagNames = cucumberTags.map(function(tag) {
      tags.push(tag.getName());
    });

    data.tags = data.tags || [];
    data.tags.push(tagNames);
  }

  return this.put({ body: data });
}

SauceLabs.prototype.isJobPassed = function(isPassed) {
  return this.put({
    body: { passed: isPassed }
  });
}

SauceLabs.prototype.getJobUrl = function() {
  return this.options.driver.getSession().then(session => {
    return [this.options.host, 'beta/tests', session.getId()].join('/');
  });
}

SauceLabs.prototype.put = function(data) {
  const {
    options: {
      username,
      accessKey,
      session_id,
      host,
      base,
    }
  } = this

  function makeRequest(message) {
    Object.assign(message, {
      auth: {
        user: username,
        pass: accessKey,
      },
      maxAttempts: 5,
      retryDelay: 5000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
    })

    log('[nemo-saucelabs] Request to Sauce Labs API with parameters:', message);

    return new Promise(function(resolve, reject) {
      request(message, function(err, response) {

        if (err) {
          const errMessage = `Error in processing Sauce Labs request: ${err.message}`;
          debug(errMessage);
          return reject(errMessage);
        }

        if (response.statusCode === 200) {
          debug('Successful response from Sauce Labs API');
          return resolve();
        }

        const errMessage = `Request to Sauce Labs API is unsuccessful with statusCode: ${response.statusCode}`;
        debug(errMessage);
        return reject(errMessage);
      })
    })
  };

  return this.options.driver.getSession().then(function(session) {
    const sessionId = session_id || session.getId()
    Object.assign(data, {
      url: `${host}/${base}/${username}/jobs/${sessionId}`,
      method: 'PUT',
    })
    const message = Object.assign({}, DEFAULTS, data);
    return makeRequest(message);
  });
}

module.exports = SauceLabs;
