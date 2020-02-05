import * as express from 'express';
import { ExpressConfigApplication } from '../../src/config/express-config.application';
import { ExpressController } from '../../src/presentation/express-controller';

describe('ExpressDevGateConfigApplication', () => {
  let app: ExpressConfigApplication;
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
    app = new ExpressConfigApplication([]);
  });

  it('Should create valid instance of ExpressDevGateConfigApplication', () => {
    expect(app).toBeTruthy();
    expect(app).toBeInstanceOf(ExpressConfigApplication);
  });

  describe('setup', () => {
    it('Should register every gate controller received on the gate express application', () => {
      const controllers = [new MockController(), new MockController()];
      app = new ExpressConfigApplication(controllers);
      return app
        .setup()
        .then(() => {
          expect(registerMock).toBeCalledTimes(2);
        })
        .catch(() => fail('Promise should resolve'));
    });
  });

  describe('start', () => {
    it('Should start config server on port 8089 given DEV_GATE_CONFIG_PORT is undefined', () => {
      app.start();
      expect(listenMock).toBeCalledWith(8089);
    });

    it('Should start config server on port 8081 given DEV_GATE_CONFIG_PORT is "8081"', () => {
      process.env.DEV_GATE_CONFIG_PORT = '8081';
      app.start();
      expect(listenMock).toBeCalledWith('8081');
    });
  });
});
