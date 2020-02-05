import { Mock } from '../model/mock.route';

export interface GetMockListUseCase {
  execute(): Promise<Mock[]>;
}
