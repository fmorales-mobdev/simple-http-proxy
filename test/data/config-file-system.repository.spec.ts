import { ConfigRepository } from '../../src/domain/repository/config.repository';
import { ConfigFileSystemRepository } from '../../src/data/repository/config-file-system.repository';
import { FileDataSource } from '../../src/data/datasource/file.datasource';
import { DevGateConfiguration } from '../../src/domain/model/dev-gate-configuration';
import { DevGateConfigurationToConfigurationEntityMapper } from '../../src/data/mapper/dev-gate-configuration-to-configuration-entity.mapper';

describe('Config File System Repository', () => {
  class MockFileDataSource implements FileDataSource {
    constructor(private mockEntity: any) {}

    getEntity<T>(): Promise<T> {
      return Promise.resolve(this.mockEntity as T);
    }

    getEntities<T>(): Promise<T[]> {
      throw new Error('Method not implemented.');
    }
  }

  const validConfigurationEntity = {
    serverPort: 8080,
    configPort: 8089,
  };
  const fileDataSource: FileDataSource = new MockFileDataSource(
    validConfigurationEntity
  );
  const mapper = new DevGateConfigurationToConfigurationEntityMapper();
  const configFileSystemRepository: ConfigRepository = new ConfigFileSystemRepository(
    fileDataSource,
    mapper
  );

  it('Should resolve Configuration given valid Configuration Entity is resolved from file datasource', () => {
    return configFileSystemRepository.getConfiguration().then(configuration => {
      expect(configuration).toBeInstanceOf(DevGateConfiguration);
      expect(configuration.configPort).toEqual(
        validConfigurationEntity.configPort
      );
      expect(configuration.serverPort).toEqual(
        validConfigurationEntity.serverPort
      );
    });
  });

  it('Should reject given getEntity rejects', done => {
    fileDataSource.getEntity = jest.fn(() => Promise.reject());
    return configFileSystemRepository.getConfiguration().catch(() => done());
  });
});
