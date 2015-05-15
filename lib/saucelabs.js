/*-----------------------------------------------------------------------------------------*\
 |  The MIT License (MIT)                                                                    |
 |                                                                                           |
 |  Copyright (c) 2015 PayPal                                                                |
 |                                                                                           |
 |  Permission is hereby granted, free of charge, to any person obtaining a copy             |
 |  of this software and associated documentation files (the "Software"), to deal            |
 |  in the Software without restriction, including without limitation the rights             |
 |  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                |
 |  copies of the Software, and to permit persons to whom the Software is                    |
 |  furnished to do so, subject to the following conditions:                                 |
 |                                                                                           |
 |      The above copyright notice and this permission notice shall be included in           |
 |  all copies or substantial portions of the Software.                                      |
 |                                                                                           |
 |      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR           |
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

"use strict";

var _               = require('underscore');
var request         = require('requestretry');
var debug           = require('debug');
var log             = debug('nemo-saucelabs:log');

var DEFAULTS = {
    host:   'https://saucelabs.com',
    base:   'rest/v1',
    json:   true,
    headers: {
        'Accept':         'application/json',
        'Content-Type':   'application/json'
    }
};

function SauceLabs(options) {

    if(options.username === undefined || options.accessKey === undefined){
        throw new Error("Sauce labs username and/or accessKey is undefined. Please specify through config.");
    }

    this.options = _.defaults({}, DEFAULTS, options);
};

SauceLabs.prototype = {

    updateJob: function updateJob(data, callback) {

        if(data.cucumber_tags !== undefined) {

            var tags = [];
            data.cucumber_tags.map(function (tag) {
                tags.push(tag.getName());
            });

            if(data.tags === undefined) {
                data.tags = [];
            }

            data.tags.push(tags);
        }

        this.put({ body: data }, callback);

    },

    isJobPassed: function isJobPassed(isPassed, callback) {

        this.put({ body: {passed: isPassed} }, callback);

    },

    getJobUrl: function getJobUrl() {

        var that = this;

        var jobUrl;

        this.options.driver.getSession().then(function buildUrl(session) {

            if (that.options.session_id === undefined) {
                that.options.session_id = session.id_;
            }
            return [that.options.host, 'tests', that.options.session_id].join('/');

        }).then(function getUrl(url) {
            jobUrl= url;
        });

        return jobUrl;
    },

    put: function put(options, callback) {

        var that = this;

        this.options.driver.getSession().then(function (session) {

            if(that.options.session_id === undefined) {
                that.options.session_id = session.id_;
            }

            options.url = [that.options.host, that.options.base, that.options.username, 'jobs', that.options.session_id].join('/');

            options.method = 'PUT';

            var message = _.extend({}, DEFAULTS, options);

            that.makeRequest(message, callback);

        });
    },

    makeRequest: function makeRequest(message, callback) {

        log("[nemo-saucelabs] sauce Request", message);

        message.auth = {user: this.options.username, pass: this.options.accessKey};
        message.maxAttempts = 5;
        message.retryDelay = 5000;
        message.retryStrategy = request.RetryStrategies.HTTPOrNetworkError;

        request(message, function(err,response, body){

            if(response.statusCode !== 200) {
                throw new Error("[nemo-saucelabs] reuqest is not success. Response status code is: " + response.statusCode);
            } else if(err){
                throw new Error("[nemo-saucelabs] error in processing Saucelabs request", err.message);
            }

            callback();
        });
    }
};

module.exports = SauceLabs;