import { RouteMethods } from '../../domain/model/route';

export interface ProxyEntity {
  method: RouteMethods;
  path: string;
  target: string;
}
