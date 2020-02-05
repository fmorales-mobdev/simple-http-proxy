import { Proxy } from '../model/proxy.route';

export interface ProxyRepository {
  getProxies(): Promise<Proxy[]>;
}
