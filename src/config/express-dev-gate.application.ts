import { ExpressController } from '../presentation/express-controller';
import { ExpressApplication } from './express.application';

export class ExpressDevGateApplication extends ExpressApplication {
  constructor(controllers: ExpressController[]) {
    super(controllers);
  }

  start() {
    this.app.listen(process.env.DEV_GATE_SERVER_PORT || 8080);
  }
}
