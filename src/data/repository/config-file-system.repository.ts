import { ConfigRepository } from '../../domain/repository/config.repository';
import { FileDataSource } from '../datasource/file.datasource';
import { DevGateConfiguration } from '../../domain/model/dev-gate-configuration';
import { ConfigurationEntity } from '../entity/configuration.entity';
import { DevGateConfigurationToConfigurationEntityMapper } from '../mapper/dev-gate-configuration-to-configuration-entity.mapper';

export class ConfigFileSystemRepository implements ConfigRepository {
  constructor(
    private fileDataSource: FileDataSource,
    private devGateConfigurationToConfigurationMapper: DevGateConfigurationToConfigurationEntityMapper
  ) {}

  getConfiguration(): Promise<DevGateConfiguration> {
    return this.fileDataSource
      .getEntity<ConfigurationEntity>()
      .then(configEntity =>
        this.devGateConfigurationToConfigurationMapper.reverseMap(configEntity)
      );
  }
}
