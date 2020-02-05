import * as express from 'express';
import { ExpressController } from '../presentation/express-controller';

export abstract class ExpressApplication {
  protected app: express.Application;

  constructor(private controllers: ExpressController[]) {
    this.app = express();
  }

  setup() {
    return Promise.all(
      this.controllers.map(controller => controller.registerOn(this.app))
    );
  }

  abstract start(): void;
}
