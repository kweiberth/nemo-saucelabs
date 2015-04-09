'use strict';
var SauceLabs   = require("./lib/saucelabs");

module.exports = {

    setup: function(config, result, callback) {

        var returnObj = result;

        /** @namespace that.props.serverCaps */
        var options = {
            username: config.serverCaps.username,
            access_key: config.serverCaps.accessKey,
            driver: result.driver
        };

        returnObj.saucelabs = new SauceLabs(options);

        callback(null, config, returnObj);
    }
};