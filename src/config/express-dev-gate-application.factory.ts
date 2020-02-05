import { JsonFileDataSource } from '../data/datasource/json-file.datasource';
import { MockToMockEntityMapper } from '../data/mapper/mock-to-mock-entity.mapper';
import { ProxyToProxyEntityMapper } from '../data/mapper/proxy-to-proxy-entity.mapper';
import { MockFileSystemRepository } from '../data/repository/mock-file-system.repository';
import { ProxyFileSystemRepository } from '../data/repository/proxy-file-system.repository';
import { GetMockListUseCaseImpl } from '../domain/usecase/get-mock-list-usecase.impl';
import { GetProxyListUseCaseImpl } from '../domain/usecase/get-proxy-list-usecase.impl';
import { GateController } from '../presentation/gate-express.controller';
import { ExpressDevGateApplication } from './express-dev-gate.application';

export class ExpressDevGateApplicationFactory {
  private constructor() {}
  static build() {
    const proxyDataSource = new JsonFileDataSource('proxy.json');
    const proxyToProxyEntityMapper = new ProxyToProxyEntityMapper();
    const proxyRepository = new ProxyFileSystemRepository(
      proxyDataSource,
      proxyToProxyEntityMapper
    );
    const getProxyListUseCase = new GetProxyListUseCaseImpl(proxyRepository);

    const mockDataSource = new JsonFileDataSource('mock.json');
    const mockToMockEntityMapper = new MockToMockEntityMapper();
    const mockRepository = new MockFileSystemRepository(
      mockDataSource,
      mockToMockEntityMapper
    );
    const getMockListUseCase = new GetMockListUseCaseImpl(mockRepository);

    return new ExpressDevGateApplication([
      new GateController(getMockListUseCase, getProxyListUseCase),
    ]);
  }
}
