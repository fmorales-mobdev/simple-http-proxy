import { MockRepository } from '../../domain/repository/mock.repository';
import { FileDataSource } from '../datasource/file.datasource';
import { MockToMockEntityMapper } from '../mapper/mock-to-mock-entity.mapper';
import { Mock } from '../../domain/model/mock.route';
import { MockEntity } from '../entity/mock.entity';

export class MockFileSystemRepository implements MockRepository {
  constructor(
    private mockDataSource: FileDataSource,
    private fromMockToMockEntityMapper: MockToMockEntityMapper
  ) {}

  getMocks(): Promise<Mock[]> {
    return this.mockDataSource
      .getEntities<MockEntity>()
      .then(result => this.fromMockToMockEntityMapper.reverseMapArray(result));
  }
}
