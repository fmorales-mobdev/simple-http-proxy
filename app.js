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
		console.info("Incoming connection from: " + req.connection.remoteAddress);
      httpProxy.web(req, res, { target: proxy.target, changeOrigin: false });
    };

    if (proxy.paths && proxy.paths.length > 0) {
      handler = express.Router();

      proxy.paths.forEach(pathEntry => {
        expressApp.all(pathEntry.path, (req, res) => {
			console.info("Incoming connection from: " + req.connection.remoteAddress);
          httpProxy.web(req, res, {
            target: pathEntry.target,
            changeOrigin: false
          });
        });
      });
    }

    expressApp.use(vhost(proxy.host, handler));
  });
  
  return expressApp;
}

app = createExpressApplication();

if (require.main === module) {
	app.listen(80);
}


module.exports = app;
