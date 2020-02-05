import { MockEntity } from '../entity/mock.entity';

export interface FileDataSource {
  getEntity<T>(): Promise<T>;
  getEntities<T>(): Promise<T[]>;
}
