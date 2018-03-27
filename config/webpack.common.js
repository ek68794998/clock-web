const path = require("path");
const webpack = require("webpack");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function(options, webpackOptions) {
    options = options || {};

    var isDebugBuild = options.env === "dev";
    var isProdBuild = options.env === "prod";

    var date = new Date();
    var dateStamp =
        "" + date.getFullYear()
        + ("00" + (1 + date.getMonth())).slice(-2)
        + ("00" + (date.getDate())).slice(-2)
        + ("00" + (date.getHours())).slice(-2)
        + ("00" + (date.getMinutes())).slice(-2)
        + ("00" + (date.getSeconds())).slice(-2);

    var buildVersionMajor = "0";
    var buildVersionMinor = "1";
    var buildVersionPatch = dateStamp;
    var buildVersion = `${buildVersionMajor}.${buildVersionMinor}.${buildVersionPatch}`;

    var rootPath = path.resolve(__dirname, "..");

    var nodeModulesPath = path.join(rootPath, "node_modules");

    var clientPath = path.join(rootPath, "src", "client");
    var servicePath = path.join(rootPath, "src", "server");

    var outputRootPath = path.join(rootPath, "wwwroot");

    console.info(`Building common configuration for version=${buildVersion}, options: ${JSON.stringify(options)}`);

    return {
        resolve: {
            extensions: [ ".ts", ".js" ],
        },
        entry: {
            app: path.join(clientPath, "main.ts"),
            polyfills: path.join(clientPath, "polyfills.ts"),
            vendor: path.join(clientPath, "vendor.ts"),
        },
        output: {
            path: path.join(outputRootPath, "js"),
            filename: "[name].build.js",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "@ngtools/webpack",
                    options: {
                        sourceMap: isDebugBuild,
                        tsConfigPath: path.join(clientPath, "tsconfig.json"),
                    },
                },
                {
                    test: /\.scss$/,
                    loaders: [ "raw-loader", "sass-loader" ],
                },
                {
                    test: /\.css$/,
                    loader: "raw-loader",
                },
                { test: /\.html$/, loader: "raw-loader" },
                { test: /\.json$/, loader: "json-loader" },
            ],
        },
        plugins: [
            // Fix for "Critical dependency: the request of a dependency is an expression"
            // Ref: https://github.com/angular/angular/issues/11580#issuecomment-282705332
            new webpack.ContextReplacementPlugin(
                /(.+)?angular(\\|\/)core(.+)?/,
                clientPath),
            new CommonsChunkPlugin({
                name: "polyfills",
                chunks: [ "polyfills" ],
            }),
            new CommonsChunkPlugin({
                name: "app",
                async: "common",
                children: true,
                minChunks: 2,
            }),
            new CopyWebpackPlugin([
                {
                    from: path.join(servicePath, "server.js"),
                    to: path.join(rootPath),
                },
                {
                    from: path.join(servicePath, ".htaccess"),
                    to: path.join(outputRootPath),
                },
                {
                    from: path.join(servicePath, "robots.txt"),
                    to: path.join(outputRootPath),
                },
                {
                    from: path.join(servicePath, "sitemap.txt"),
                    to: path.join(outputRootPath),
                },
                {
                    from: path.join(servicePath, "assets"),
                    to: path.join(outputRootPath),
                },
                {
                    from: path.join(clientPath, "i18n"),
                    to: path.join(outputRootPath, "i18n"),
                },
            ]),
            new HtmlWebpackPlugin({
                basePath: options.basePath || "/",
                buildDate: dateStamp,
                buildVersion: buildVersion,
                debug: isDebugBuild,
                filename: path.join(outputRootPath, "index.html"),
                inject: false,
                template: path.join(servicePath, "index.ejs"),
                minify:
                    isProdBuild
                        ? {
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            minifyCSS: true,
                            minifyJS: true,
                        }
                        : false,
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    "ENV": JSON.stringify(options.env),
                    "NODE_ENV": JSON.stringify(options.env),
                },
            }),
        ],
    };
};