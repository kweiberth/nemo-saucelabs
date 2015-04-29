'use strict';
var SauceLabs = require("./lib/saucelabs");

module.exports = {

    setup: function(sauceCredentials, nemo, callback) {

        var options = {
            username: sauceCredentials.username,
            access_key: sauceCredentials.accessKey,
            driver: nemo.driver
        };

        nemo.saucelabs = new SauceLabs(options);

        callback(null);
    }
};