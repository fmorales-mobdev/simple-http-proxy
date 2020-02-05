import { Mock } from '../model/mock.route';

export interface MockRepository {
  getMocks(): Promise<Mock[]>;
}
