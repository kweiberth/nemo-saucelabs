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

var _ = require('underscore');
var request = require('requestretry');
var debug = require('debug');
var log = debug('nemo-saucelabs:log');

var DEFAULTS = {
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
		throw new Error('Sauce labs username and/or accessKey is undefined. Please specify through config.');
	}

	this.options = _.defaults({}, DEFAULTS, options);
};

SauceLabs.prototype = {

	updateJob: function updateJob(data) {

		if (data.cucumber_tags !== undefined) {

			var tags = [];
			data.cucumber_tags.map(function(tag) {
				tags.push(tag.getName());
			});

			if (data.tags === undefined) {
				data.tags = [];
			}

			data.tags.push(tags);
		}

		return this.put({body: data});
	},

	isJobPassed: function isJobPassed(isPassed) {
		return this.put({body: {passed: isPassed}});
	},

	getJobUrl: function getJobUrl() {

		var session = this.options.driver.getSession();

		if (session.value_ === undefined) {
			session.then(function(currentSession) {
				session.value_ = currentSession;
			})
		}

		return [this.options.host, 'beta/tests', session.value_.id_].join('/');
	},

	put: function put(args) {

		var that = this;

		var deferred = this.options.wd.promise.defer();

		function makeRequest(message) {

			log('[nemo-saucelabs] sauce Request', message);

			message.auth = {user: that.options.username, pass: that.options.accessKey};
			message.maxAttempts = 5;
			message.retryDelay = 5000;
			message.retryStrategy = request.RetryStrategies.HTTPOrNetworkError;

			request(message, function(err, response, body) {

				var errMessage;

				if (response.statusCode !== 200) {
					errMessage = 'reuqest is not success. Response status code is: ' + response.statusCode;
					debug(errMessage);
					deferred.reject(errMessage);
				} else if (err) {
					errMessage = 'error in processing Saucelabs request: ' + err.message;
					debug(errMessage);
					deferred.reject(errMessage);
				} else {
					debug('successful response fron sauce labs rest api. Fulfililng promise with status code: ' + response.statusCode);
					deferred.fulfill();
				}

				log('response status code', response.statusCode);

				return deferred;
			});

			return deferred;
		}

		return this.options.driver.getSession().then(function(session) {

			if (that.options.session_id === undefined) {
				that.options.session_id = session.id_;
			}

			args.url = [that.options.host, that.options.base, that.options.username, 'jobs', that.options.session_id].join('/');

			args.method = 'PUT';

			var message = _.extend({}, DEFAULTS, args);

			return makeRequest(message);

		});
	}
};

module.exports = SauceLabs;
