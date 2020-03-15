"use strict";

const { app } = require("./app");

require("greenlock-express")
  .init({
    packageRoot: __dirname,
    configDir: "./greenlock.d",
    maintainerEmail: "felipe@moralesm.cl",
    cluster: false
  })
  .serve(app);
