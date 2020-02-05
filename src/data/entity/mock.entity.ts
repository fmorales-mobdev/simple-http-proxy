import { RouteMethods } from '../../domain/model/route';

export interface MockEntity {
  method: RouteMethods;
  path: string;
  responseBody: any;
}
