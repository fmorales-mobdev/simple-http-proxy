import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { Mock } from '../domain/model/mock.route';
import { Proxy } from '../domain/model/proxy.route';
import { GetMockListUseCase } from '../domain/usecase/get-mock-list.usecase';
import { GetProxyListUseCase } from '../domain/usecase/get-proxy-list.usecase';
import { ExpressController } from './express-controller';
import Server = require('http-proxy');

export class GateController implements ExpressController {
  proxyServer: Server = httpProxy.createProxyServer({});

  constructor(
    private getMockListUseCase: GetMockListUseCase,
    private getProxyListUseCase: GetProxyListUseCase
  ) {}

  registerOn(app: express.Application): Promise<void> {
    return Promise.all([
      this.getMockListUseCase.execute(),
      this.getProxyListUseCase.execute(),
    ]).then(([mocks, proxies]) => {
      this.registerMocks(mocks, app);
      this.registerProxies(proxies, app);
    });
  }

  private registerProxies(proxies: Proxy[], app: express.Application) {
    for (const proxy of proxies) {
      app[proxy.method](
        proxy.path,
        (req: express.Request, res: express.Response) => {
          this.proxyServer.web(req, res, { target: proxy.target });
        }
      );
    }
  }

  private registerMocks(mocks: Mock[], app: express.Application) {
    for (const mock of mocks) {
      app[mock.method](
        mock.path,
        (req: express.Request, res: express.Response) =>
          res.send(mock.responseBody)
      );
    }
  }
}
