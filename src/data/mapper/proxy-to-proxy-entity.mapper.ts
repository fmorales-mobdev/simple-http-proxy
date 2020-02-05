import { Mapper } from '../../common/mapper';
import { Proxy } from '../../domain/model/proxy.route';
import { ProxyEntity } from '../entity/proxy.entity';

export class ProxyToProxyEntityMapper extends Mapper<Proxy, ProxyEntity> {
  map(value: Proxy): ProxyEntity {
    throw new Error('Method not implemented.');
  }

  reverseMap(value: ProxyEntity): Proxy {
    return new Proxy(value.method, value.path, value.target);
  }
}
