import { ProxyRepository } from '../../domain/repository/proxy.repository';
import { FileDataSource } from '../../data/datasource/file.datasource';
import { ProxyToProxyEntityMapper } from '../mapper/proxy-to-proxy-entity.mapper';
import { Proxy } from '../../domain/model/proxy.route';
import { ProxyEntity } from '../entity/proxy.entity';

export class ProxyFileSystemRepository implements ProxyRepository {
  constructor(
    private proxyDataSource: FileDataSource,
    private fromProxyToProxyEntityMapper: ProxyToProxyEntityMapper
  ) {}

  getProxies(): Promise<Proxy[]> {
    return this.proxyDataSource
      .getEntities<ProxyEntity>()
      .then(result =>
        this.fromProxyToProxyEntityMapper.reverseMapArray(result)
      );
  }
}
