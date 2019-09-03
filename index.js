const express = require('express');
const config = require(process.argv[2] ? './' + process.argv[2] : './config.json');

let app = express();
let httpProxy = require('http-proxy').createProxyServer({});

httpProxy.on('error', (err) => {
    console.log(err);
});

httpProxy.on("proxyRes", function(proxyRes, req, res) {
    proxyRes.headers['access-control-allow-origin'] = '*';
	if (req.headers['access-control-request-method']) {
		res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
	}

	if (req.headers['access-control-request-headers']) {
		res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
	}
});

config.proxy.forEach(proxy => {
    app.all(proxy.path, (req, res) => {
        httpProxy.web(req, res, { target: proxy.target, changeOrigin: true });
    });
});

app.listen(config.port, function () {
    console.log(`Proxy escuchando en puerto: ${config.port}`);
});