const webpackMerge = require("webpack-merge");
const commonConfiguration = require("./webpack.common.js");

module.exports = function(options, webpackOptions) {
    options = options || {};

    var env = options.env || "dev";
    console.info(`Building configuration for '${env}' environment`);

    var commonOptions = {
        basePath: "/",
        env: env,
    };

    var envConfig = {
    };

    return webpackMerge(commonConfiguration(commonOptions, webpackOptions), envConfig);
};