'use strict';
var SauceLabs = require("./lib/saucelabs");

module.exports = {

    setup: function(nemo, callback) {

        var options = {
            username: nemo._config.get('driver').serverCaps.username,
            accessKey: nemo._config.get('driver').serverCaps.accessKey,
            driver: nemo.driver
        };

        nemo.saucelabs = new SauceLabs(options);

        callback(null);
    }
};