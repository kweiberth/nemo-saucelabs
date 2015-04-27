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

    if(options.username === undefined || options.access_key === undefined){
        throw new Error("Saucelabs username and/or access_key is undefined. Please specify through config.");
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

        message.auth = {user: this.options.username, pass: this.options.access_key};
        message.maxAttempts = 5;
        message.retryDelay = 5000;
        message.retryStrategy = request.RetryStrategies.HTTPOrNetworkError;

        request(message, function(err,response, body){

            if(response.statusCode !== 200) {
                throw new Error("[nemo-saucelabs] reuqest is not success. Response status code is: " + response.statusCode);
            } else if(err){
                throw new Error("[nemo-saucelabs] error in processing Saucelabs request", err.message);
            }

            log("[nemo-saucelabs] response status code", response.statusCode);

            callback();
        });
    }
};

module.exports = SauceLabs;