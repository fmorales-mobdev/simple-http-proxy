import { Mapper } from '../../common/mapper';
import { DevGateConfiguration } from '../../domain/model/dev-gate-configuration';
import { ConfigurationEntity } from '../entity/configuration.entity';

export class DevGateConfigurationToConfigurationEntityMapper extends Mapper<
  DevGateConfiguration,
  ConfigurationEntity
> {
  map(value: DevGateConfiguration): ConfigurationEntity {
    throw new Error('Method not implemented.');
  }

  reverseMap(value: ConfigurationEntity): DevGateConfiguration {
    return new DevGateConfiguration(value.serverPort, value.configPort);
  }
}
