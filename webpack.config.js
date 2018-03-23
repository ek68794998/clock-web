// Loads the appropriate Webpack configuration based on environment.
switch (process.env.NODE_ENV) {
    case "prod":
    case "production":
        module.exports = require("./config/webpack.prod")({ env: "prod" });
        break;
    case "int":
    case "integration":
    case "dev":
    case "development":
    default:
        module.exports = require("./config/webpack.dev")({ env: "dev" });
        break;
}
