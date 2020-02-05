import * as express from 'express';
import { ExpressDevGateApplication } from '../../src/config/express-dev-gate.application';
import { ExpressController } from '../../src/presentation/express-controller';

describe('ExpressDevGateApplication', () => {
  let app: ExpressDevGateApplication;
  let listenMock: jest.Mock;
  const registerMock = jest.fn();

  class MockController implements ExpressController {
    registerOn = registerMock;
  }

  beforeEach(() => {
    delete process.env.DEV_GATE_SERVER_PORT;
    delete process.env.DEV_GATE_CONFIG_PORT;
    listenMock = express.application.listen = jest.fn();
    listenMock.mockReset();
    registerMock.mockReset();
    app = new ExpressDevGateApplication([]);
  });

  it('Should create valid instance of ExpressDevGateApplication', () => {
    expect(app).toBeTruthy();
    expect(app).toBeInstanceOf(ExpressDevGateApplication);
  });

  describe('setup', () => {
    it('Should register every gate controller received on the gate express application', () => {
      const controllers = [new MockController(), new MockController()];
      app = new ExpressDevGateApplication(controllers);
      return app
        .setup()
        .then(() => {
          expect(registerMock).toBeCalledTimes(2);
        })
        .catch(() => fail('Promise should resolve'));
    });
  });

  describe('start', () => {
    it('Should start gate server on port 8080 given DEV_GATE_SERVER_PORT is undefined', () => {
      app.start();
      expect(listenMock).toBeCalledWith(8080);
    });

    it('Should start gate server on port 8081 given DEV_GATE_SERVER_PORT is "8081"', () => {
      process.env.DEV_GATE_SERVER_PORT = '8081';
      app.start();
      expect(listenMock).toBeCalledWith('8081');
    });
  });
});
