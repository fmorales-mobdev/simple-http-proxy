import { ExpressConfigApplicationFactory } from '../../src/config/express-config-application.factory';
import { ExpressConfigApplication } from '../../src/config/express-config.application';

describe('express config application factory', () => {
  it('Should create valid instance of ExpressConfigApplication', () => {
    const app = ExpressConfigApplicationFactory.build();
    expect(app).toBeInstanceOf(ExpressConfigApplication);
  });
});
