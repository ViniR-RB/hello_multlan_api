import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import EnvironmentVariables from '../env.validation';
@Injectable()
export default class ConfigurationService {
  constructor(
    private readonly configurationService: ConfigService<
      EnvironmentVariables,
      true
    >,
  ) {}

  get<T extends keyof EnvironmentVariables>(key: T) {
    return this.configurationService.get(key, { infer: true });
  }
}
