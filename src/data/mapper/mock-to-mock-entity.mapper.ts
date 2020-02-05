import { Mapper } from '../../common/mapper';
import { Mock } from '../../domain/model/mock.route';
import { MockEntity } from '../entity/mock.entity';

export class MockToMockEntityMapper extends Mapper<Mock, MockEntity> {
  map(value: Mock): MockEntity {
    throw new Error('Method not implemented.');
  }

  reverseMap(value: MockEntity): Mock {
    return new Mock(value.method, value.path, value.responseBody);
  }
}
