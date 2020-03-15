const configFile = process.argv[2] ? './' + process.argv[2] : './config.json'
const express = require('express');
const vhost = require('vhost');

let config = JSON.parse(require("fs").readFileSync(configFile));

let httpProxy = require('http-proxy').createProxyServer({});

httpProxy.on('error', (err) => {
    console.log(err);
});

function loadConfiguration() {
    config = JSON.parse(require("fs").readFileSync(configFile));
}

function createExpressApplication() {
    loadConfiguration();
    
    let expressApp = express();

    config.proxy.forEach(proxy => {
        let handler = (req, res) => {
            httpProxy.web(req, res, { target: proxy.target, changeOrigin: false });
        };
        
        if(proxy.paths && proxy.paths.length > 0) {
            handler = express.Router();

            proxy.paths.forEach(pathEntry => {
                expressApp.all(pathEntry.path, (req, res) => {
                    httpProxy.web(req, res, { target: pathEntry.target, changeOrigin: false });
                });
            });
        }

        expressApp.use(vhost(proxy.host, handler));
    });

    return expressApp;
}

let app = createExpressApplication();

require("greenlock-express")
    .init({
        packageRoot: __dirname,
        configDir: "./greenlock.d",
        maintainerEmail: "felipe@moralesm.cl",
        cluster: false
    })
    .serve(app);

