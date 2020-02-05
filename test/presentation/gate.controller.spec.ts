import * as express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import * as supertest from 'supertest';
import { Mock } from '../../src/domain/model/mock.route';
import { Proxy } from '../../src/domain/model/proxy.route';
import { RouteMethods } from '../../src/domain/model/route';
import { GetMockListUseCase } from '../../src/domain/usecase/get-mock-list.usecase';
import { GetProxyListUseCase } from '../../src/domain/usecase/get-proxy-list.usecase';
import { GateController } from '../../src/presentation/gate-express.controller';

describe('gate controller: for registering mocks and proxies', () => {
  let gateController: GateController;
  let testGetMocksupsUseCase: GetMockListUseCase;
  let testProxyListUseCase: GetProxyListUseCase;
  const request = supertest as any;
  let app: express.Application;
  let targetApp: express.Application;
  let targetServer: Server;

  let returnedMockList: Mock[] = [];

  class GetMocksupsUseCaseTestImplementation implements GetMockListUseCase {
    execute() {
      return Promise.resolve(returnedMockList);
    }
  }

  let returnedProxyList: Proxy[] = [];

  class GetProxyListUseCaseTestImplementation implements GetProxyListUseCase {
    execute() {
      return Promise.resolve(returnedProxyList);
    }
  }

  beforeEach(done => {
    app = express();
    returnedMockList = [];
    returnedProxyList = [];
    testGetMocksupsUseCase = new GetMocksupsUseCaseTestImplementation();
    testProxyListUseCase = new GetProxyListUseCaseTestImplementation();
    gateController = new GateController(
      testGetMocksupsUseCase,
      testProxyListUseCase
    );

    targetApp = express();
    targetServer = targetApp.listen(() => {
      done();
    });
  });

  afterEach(() => {
    targetServer.close();
  });

  it('Constructor should return a valid instance of ExpressController', () => {
    expect(typeof gateController.registerOn).toEqual('function');
  });

  it('Should register each mockup returned from get mock list use case', done => {
    populateMockList();
    gateController
      .registerOn(app)
      .then(() => performRequestOnMocksAndValidate())
      .then(() => {
        done();
      });
  });

  it('Should register every proxy returned from get proxy list usecase', done => {
    populateProxyList();
    gateController
      .registerOn(app)
      .then(() => verifyProxies())
      .then(() => done());
  });

  it('Should return a mock response given there is a mock and a proxy for the same endpoint', done => {
    setRepeatedEndpoints();
    gateController
      .registerOn(app)
      .then(() => performRequestOnMocksAndValidate())
      .then(() => done());
  });

  function populateMockList() {
    returnedMockList = [
      {
        method: 'get',
        path: '/some/path/one',
        responseBody: {
          attributeOne: 'attributeOne',
        },
      },
      {
        method: 'post',
        path: '/some/path/two',
        responseBody: {
          attributeTwo: 'attributeTwo',
        },
      },
    ];
  }

  function performRequestOnMocksAndValidate(): Promise<any[]> {
    return Promise.all(
      returnedMockList.map(mock =>
        request(app)
          [mock.method](mock.path)
          .then((res: any) => {
            expect(res.body).toEqual(mock.responseBody);
          })
      )
    );
  }

  function populateProxyList() {
    const target =
      'http://localhost:' + (targetServer.address() as AddressInfo).port;
    returnedProxyList = [
      {
        method: 'get',
        path: '/some/path/one',
        target,
      },
      {
        method: 'post',
        path: '/some/path/two',
        target,
      },
    ];
    return returnedProxyList;
  }

  function verifyProxies() {
    return Promise.all(
      returnedProxyList.map(proxy => {
        const targetResponse = proxy;
        const mockEndpointHandler = jest.fn(
          (req: express.Request, res: express.Response) =>
            res.send(targetResponse)
        );

        targetApp.use(proxy.path, mockEndpointHandler);
        return performRequestOnProxyAndValidate(
          proxy,
          targetResponse,
          mockEndpointHandler
        );
      })
    );
  }

  function performRequestOnProxyAndValidate(
    proxy: Proxy,
    targetResponse: Proxy,
    mockEndpointHandler: jest.Mock
  ) {
    return request(app)
      [proxy.method](proxy.path)
      .then((res: any) => {
        expect(res.body).toEqual(targetResponse);
        expect(mockEndpointHandler).toBeCalledTimes(1);
        expect(mockEndpointHandler.mock.calls[0][0].baseUrl).toEqual(
          proxy.path
        );
        expect(mockEndpointHandler.mock.calls[0][0].method).toEqual(
          proxy.method.toUpperCase()
        );
      });
  }

  function setRepeatedEndpoints() {
    const target =
      'http://localhost:' + (targetServer.address() as AddressInfo).port;

    const repeatedEndpoint: { path: string; method: RouteMethods } = {
      path: '/repeated/path',
      method: 'get',
    };

    returnedMockList = [
      {
        ...repeatedEndpoint,
        responseBody: {
          reponse: 'expected response',
        },
      },
    ];
    returnedProxyList = [{ ...repeatedEndpoint, target }];
  }
});
