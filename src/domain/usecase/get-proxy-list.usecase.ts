import { Proxy } from '../model/proxy.route';

export interface GetProxyListUseCase {
  execute(): Promise<Proxy[]>;
}
