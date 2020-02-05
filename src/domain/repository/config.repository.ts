import { DevGateConfiguration } from '../model/dev-gate-configuration';

export interface ConfigRepository {
  getConfiguration(): Promise<DevGateConfiguration>;
}
