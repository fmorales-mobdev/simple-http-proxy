import { MockFileSystemRepository } from '../../src/data/repository/mock-file-system.repository';
import { FileDataSource } from '../../src/data/datasource/file.datasource';
import { MockEntity } from '../../src/data/entity/mock.entity';
import { MockToMockEntityMapper } from '../../src/data/mapper/mock-to-mock-entity.mapper';
import { Mock } from '../../src/domain/model/mock.route';

describe('mock file system repository', () => {
  let mockFileSystemRepository: MockFileSystemRepository;
  let fileSystemDataSource: FileDataSource;
  let fromMockToMockEntityMapper: MockToMockEntityMapper;
  let validMockEntityOne: MockEntity;
  let validMockEntityTwo: MockEntity;

  class MockFileDataSource implements FileDataSource {
    constructor(public mockEntities: any[]) {}

    getEntities<MockEntity>(): Promise<MockEntity[]> {
      return Promise.resolve(this.mockEntities);
    }

    getEntity<T>(): Promise<T> {
      return Promise.resolve({} as T);
    }
  }

  beforeEach(() => {
    validMockEntityOne = {
      method: 'get',
      path: 'path/one',
      responseBody: {
        bodyOne: 'one',
      },
    };
    validMockEntityTwo = {
      method: 'post',
      path: 'path/two',
      responseBody: {
        bodyTwo: 'two',
      },
    };

    fileSystemDataSource = new MockFileDataSource([
      validMockEntityOne,
      validMockEntityTwo,
    ]);
    fromMockToMockEntityMapper = new MockToMockEntityMapper();
    mockFileSystemRepository = new MockFileSystemRepository(
      fileSystemDataSource,
      fromMockToMockEntityMapper
    );
  });

  it('Should return list of mock when datasource return a list of valid entities', () => {
    const expectedItemOne = new Mock(
      validMockEntityOne.method,
      validMockEntityOne.path,
      validMockEntityOne.responseBody
    );

    const expectedItemTwo = new Mock(
      validMockEntityTwo.method,
      validMockEntityTwo.path,
      validMockEntityTwo.responseBody
    );

    return mockFileSystemRepository.getMocks().then(result => {
      expect(result.length).toEqual(2);
      expect(result).toContainEqual(expectedItemOne);
      expect(result).toContainEqual(expectedItemTwo);
    });
  });

  it('Should return a rejected promise when FileDataSources returns a rejected promise', done => {
    fileSystemDataSource.getEntities = jest.fn(() => Promise.reject());

    mockFileSystemRepository.getMocks().catch(() => {
      done();
    });
  });
});
