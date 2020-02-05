import { MockRepository } from '../repository/mock.repository';
import { GetMockListUseCase } from './get-mock-list.usecase';

export class GetMockListUseCaseImpl implements GetMockListUseCase {
  constructor(private mockRepository: MockRepository) {}

  execute() {
    return this.mockRepository.getMocks();
  }
}
