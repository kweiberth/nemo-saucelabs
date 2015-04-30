'use strict';
var SauceLabs = require("./lib/saucelabs");

module.exports = {

    setup: function(nemo, callback) {

        var options = {
            username: process.env['driver'].serverCaps.username,
            access_key: process.env['driver'].serverCaps.accessKey,
            driver: nemo.driver
        };

        nemo.saucelabs = new SauceLabs(options);

        callback(null);
    }
};