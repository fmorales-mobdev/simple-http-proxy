import { Proxy } from '../../src/domain/model/proxy.route';
import { ProxyRepository } from '../../src/domain/repository/proxy.repository';
import { GetProxyListUseCaseImpl } from '../../src/domain/usecase/get-proxy-list-usecase.impl';

describe('getProxyListUseCase', () => {
  let getProxyListUseCase: GetProxyListUseCaseImpl;
  let proxyRepository: ProxyRepository;
  let proxyListResult: Proxy[];

  class ProxyRepositoryMock implements ProxyRepository {
    getProxies = jest.fn(() => Promise.resolve(proxyListResult));
  }

  beforeEach(() => {
    proxyListResult = [
      {
        method: 'get',
        path: '/some/path/one',
        target: 'http://sometarget.one',
      },
      {
        method: 'post',
        path: '/some/path/two',
        target: 'http://sometarget.two',
      },
    ];
    proxyRepository = new ProxyRepositoryMock();
    getProxyListUseCase = new GetProxyListUseCaseImpl(proxyRepository);
  });

  it('Should return a list of proxies given a valid response from proxyRepository', () => {
    getProxyListUseCase.execute().then(actual => {
      expect(proxyListResult).toEqual(actual);
    });
  });

  it('Should return a rejected promise given proxyRepository error', done => {
    proxyRepository.getProxies = jest.fn(() => Promise.reject());
    getProxyListUseCase.execute().catch(() => done());
  });
});
