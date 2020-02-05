import { Mock } from '../../src/domain/model/mock.route';
import { MockRepository } from '../../src/domain/repository/mock.repository';
import { GetMockListUseCaseImpl } from '../../src/domain/usecase/get-mock-list-usecase.impl';

describe('getMockListUseCase', () => {
  let getMockListUseCase: GetMockListUseCaseImpl;
  let mockRepository: MockRepository;
  let mockListResult: Mock[];

  class MockRepositoryMock implements MockRepository {
    getMocks = jest.fn(() => Promise.resolve(mockListResult));
  }

  beforeEach(() => {
    mockListResult = [
      {
        method: 'get',
        path: '/some/path/one',
        responseBody: {
          attributeOne: 'attributeOne',
        },
      },
      {
        method: 'post',
        path: '/some/path/two',
        responseBody: {
          attributeTwo: 'attributeTwo',
        },
      },
    ];
    mockRepository = new MockRepositoryMock();
    getMockListUseCase = new GetMockListUseCaseImpl(mockRepository);
  });

  it('Should return a list of proxies given a valid response from mockRepository', () => {
    getMockListUseCase.execute().then(actual => {
      expect(mockListResult).toEqual(actual);
    });
  });

  it('Should return a rejected promise given mockRepository error', done => {
    mockRepository.getMocks = jest.fn(() => Promise.reject());
    getMockListUseCase.execute().catch(() => done());
  });
});
