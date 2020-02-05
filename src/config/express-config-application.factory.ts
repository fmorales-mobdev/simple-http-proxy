import { ExpressConfigApplication } from './express-config.application';

export class ExpressConfigApplicationFactory {
  static build() {
    return new ExpressConfigApplication([]);
  }
}
