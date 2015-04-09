/*
data: {
name: test-name,
tags: scenarios.getTags(),
passed: true/false,
build: build_id,
'custom-data': {error: 'cause of failure}}
*/

"use strict";

var _               = require('underscore');
var request         = require('requestretry');

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

    this.options = _.extend({}, DEFAULTS, options);
};

SauceLabs.prototype = {

    updateJob: function updateJob(data, callback) {

        if(data.tags !== undefined) {

            var tags=[];
            data.tags.forEach(function (tag) {
                tags.push(tag.getName());
            });

            data.tags = tags;
        }

        this.put({ body: data }, callback);

    },

    isJobPassed: function isJobPassed(isPassed, callback) {

        this.put({ body: {passed: isPassed} }, callback);

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

        console.info("Sauce Request: ", message);

        message.auth = {user: this.options.username, pass: this.options.access_key};
        message.maxAttempts = 5;
        message.retryDelay = 5000;
        message.retryStrategy = request.RetryStrategies.HTTPOrNetworkError;

        request(message, function(err,response, body){

            if(response.statusCode !== 200) {
                callback("non-200 status code: " + response.statusCode);
            }

            else if(err){
                callback(err);
            }

            callback();
        });


    }
};

module.exports = SauceLabs;