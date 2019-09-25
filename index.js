const configFile = process.argv[2] ? './' + process.argv[2] : './config.json'
const express = require('express');
let config = JSON.parse(require("fs").readFileSync(configFile));

let httpProxy = require('http-proxy').createProxyServer({});

httpProxy.on('error', (err) => {
    console.log(err);
});

httpProxy.on("proxyRes", function (proxyRes, req, res) {
    proxyRes.headers['access-control-allow-origin'] = '*';
    if (req.headers['access-control-request-method']) {
        res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
    }

    if (req.headers['access-control-request-headers']) {
        res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
    }
});

function loadConfiguration() {
    config = JSON.parse(require("fs").readFileSync(configFile));
}

function createExpressApplication() {
    loadConfiguration();
    let expressApp = express();
    config.mocks.forEach(mock => {
        const method = mock.method.trim().toLowerCase();
        expressApp[method](mock.path, (req, res) => {
            res.send(mock.responseBody);
        });
    });

    config.proxy.forEach(proxy => {
        expressApp.all(proxy.path, (req, res) => {
            httpProxy.web(req, res, { target: proxy.target, changeOrigin: true });
        });
    });

    return expressApp;
}

let app = createExpressApplication();

let server = app.listen(config.port, function () {
    console.log(`Proxy escuchando en puerto: ${config.port}`);
});

require("fs").watchFile(configFile, { interval: 500 }, () => {
    console.log('Cambios en configuración - reiniciando...')
    server.close((err) => {
        if (err) {
            process.exit(1);
        }

        app = createExpressApplication();

        server = app.listen(config.port, function () {
            console.log(`Proxy reiniciado en puerto: ${config.port}`);
        });
    });
});

