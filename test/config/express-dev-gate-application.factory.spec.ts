import { ExpressDevGateApplicationFactory } from '../../src/config/express-dev-gate-application.factory';
import { ExpressDevGateApplication } from '../../src/config/express-dev-gate.application';

describe('express dev gate application factory', () => {
  it('Should create valid instance of ExpressDevGateApplication', () => {
    const app = ExpressDevGateApplicationFactory.build();
    expect(app).toBeInstanceOf(ExpressDevGateApplication);
  });
});
