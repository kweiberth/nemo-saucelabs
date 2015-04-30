'use strict';
var SauceLabs = require("./lib/saucelabs");

module.exports = {

    setup: function(config, result, callback) {

        var returnObj = result;

        /** @namespace that.props.serverCaps */
        var options = {
            username: result.props.serverCaps.username,
            access_key: result.props.serverCaps.accessKey,
            driver: result.driver
        };

        returnObj.saucelabs = new SauceLabs(options);

        callback(null, config, returnObj);
    }
};