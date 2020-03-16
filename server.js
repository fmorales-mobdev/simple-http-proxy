'use strict';

var app = require('./app.js');

require('greenlock-express')
    .init({
        packageRoot: __dirname,
        maintainerEmail: "felipe@moralesm.cl",
        configDir: './greenlock.d',
		agreeTos: true,
        cluster: false
    })
    .serve(app);
