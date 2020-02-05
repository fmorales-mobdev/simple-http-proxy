import { ProxyRepository } from '../repository/proxy.repository';
import { GetProxyListUseCase } from './get-proxy-list.usecase';

export class GetProxyListUseCaseImpl implements GetProxyListUseCase {
  constructor(private proxyRepository: ProxyRepository) {}

  execute() {
    return this.proxyRepository.getProxies();
  }
}
