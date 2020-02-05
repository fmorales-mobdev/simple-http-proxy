import { ExpressConfigApplication } from './config/express-config.application';
import { ExpressDevGateApplicationFactory } from './config/express-dev-gate-application.factory';

const gateApp = ExpressDevGateApplicationFactory.build();
const configApp = new ExpressConfigApplication([]);

configApp
  .setup()
  .then(() => {
    configApp.start();
  })
  .then(() => gateApp.setup())
  .then(() => {
    gateApp.start();
  });
