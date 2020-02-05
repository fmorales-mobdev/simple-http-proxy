import { ExpressController } from '../presentation/express-controller';
import { ExpressApplication } from './express.application';

export class ExpressConfigApplication extends ExpressApplication {
  constructor(controllers: ExpressController[]) {
    super(controllers);
  }

  start() {
    this.app.listen(process.env.DEV_GATE_CONFIG_PORT || 8089);
  }
}
