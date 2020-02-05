import { ProxyFileSystemRepository } from '../../src/data/repository/proxy-file-system.repository';
import { FileDataSource } from '../../src/data/datasource/file.datasource';
import { ProxyEntity } from '../../src/data/entity/proxy.entity';
import { ProxyToProxyEntityMapper } from '../../src/data/mapper/proxy-to-proxy-entity.mapper';
import { Proxy } from '../../src/domain/model/proxy.route';

describe('proxy file system repository', () => {
  let proxyFileSystemRepository: ProxyFileSystemRepository;
  let fileSystemDataSource: FileDataSource;
  let fromProxyToProxyEntityMapper: ProxyToProxyEntityMapper;
  let validProxyEntityOne: ProxyEntity;
  let validProxyEntityTwo: ProxyEntity;

  class ProxyFileDataSource implements FileDataSource {
    constructor(public proxyEntities: any[]) {}

    getEntities<ProxyEntity>(): Promise<ProxyEntity[]> {
      return Promise.resolve(this.proxyEntities);
    }

    getEntity<ProxyEntity>(): Promise<ProxyEntity> {
      return Promise.resolve({} as ProxyEntity);
    }
  }

  beforeEach(() => {
    validProxyEntityOne = {
      method: 'get',
      path: 'path/one',
      target: 'http://target.one',
    };
    validProxyEntityTwo = {
      method: 'post',
      path: 'path/two',
      target: 'http://target.two',
    };

    fileSystemDataSource = new ProxyFileDataSource([
      validProxyEntityOne,
      validProxyEntityTwo,
    ]);
    fromProxyToProxyEntityMapper = new ProxyToProxyEntityMapper();
    proxyFileSystemRepository = new ProxyFileSystemRepository(
      fileSystemDataSource,
      fromProxyToProxyEntityMapper
    );
  });

  it('Should return list of proxy when datasource return a list of valid entities', () => {
    const expectedItemOne = new Proxy(
      validProxyEntityOne.method,
      validProxyEntityOne.path,
      validProxyEntityOne.target
    );

    const expectedItemTwo = new Proxy(
      validProxyEntityTwo.method,
      validProxyEntityTwo.path,
      validProxyEntityTwo.target
    );

    return proxyFileSystemRepository.getProxies().then(result => {
      expect(result.length).toEqual(2);
      expect(result).toContainEqual(expectedItemOne);
      expect(result).toContainEqual(expectedItemTwo);
    });
  });

  it('Should return a rejected promise when FileDataSources returns a rejected promise', done => {
    fileSystemDataSource.getEntities = jest.fn(() => Promise.reject());

    proxyFileSystemRepository.getProxies().catch(() => {
      done();
    });
  });
});
