process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const express = require("express");
const vhost = require("vhost");

let config = JSON.parse(require("fs").readFileSync("./config.json"));

let httpProxy = require("http-proxy").createProxyServer({});

httpProxy.on("error", err => {
  console.log(err);
});

function loadConfiguration() {
  config = JSON.parse(require("fs").readFileSync("./config.json"));
}

function createExpressApplication() {
  loadConfiguration();

  let expressApp = express();
  
  config.proxy.forEach(proxy => {
    let handler = (req, res) => {
      httpProxy.web(req, res, proxy.options);
    };

    if (proxy.paths && proxy.paths.length > 0) {
      handler = express.Router();

      proxy.paths.forEach(pathEntry => {
        expressApp.all(pathEntry.path, (req, res) => {
          httpProxy.web(req, res,
            pathEntry.options
          );
        });
      });
    }

    expressApp.use(vhost(proxy.host, handler));
  });
  
  return expressApp;
}

module.exports = createExpressApplication();
