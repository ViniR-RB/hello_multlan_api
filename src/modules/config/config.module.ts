import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import CreateConfigService from '@/modules/config/application/create_config.service';
import DeleteConfigService from '@/modules/config/application/delete_config.service';
import GetConfigByIdService from '@/modules/config/application/get_config_by_id.service';
import GetConfigsService from '@/modules/config/application/get_configs.service';
import UpdateConfigService from '@/modules/config/application/update_config.service';
import ConfigController from '@/modules/config/controller/config.controller';
import ConfigModel from '@/modules/config/infra/models/config.model';
import ConfigRepository from '@/modules/config/infra/repository/config.repository';
import {
  CONFIG_REPOSITORY,
  CREATE_CONFIG_SERVICE,
  DELETE_CONFIG_SERVICE,
  GET_CONFIG_BY_ID_SERVICE,
  GET_CONFIGS_SERVICE,
  UPDATE_CONFIG_SERVICE,
} from '@/modules/config/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CoreModule, AuthModule, TypeOrmModule.forFeature([ConfigModel])],
  controllers: [ConfigController],
  providers: [
    {
      inject: [getRepositoryToken(ConfigModel)],
      provide: CONFIG_REPOSITORY,
      useFactory: repository => new ConfigRepository(repository),
    },
    {
      inject: [CONFIG_REPOSITORY],
      provide: CREATE_CONFIG_SERVICE,
      useFactory: (configRepository: IConfigRepository) =>
        new CreateConfigService(configRepository),
    },
    {
      inject: [CONFIG_REPOSITORY],
      provide: UPDATE_CONFIG_SERVICE,
      useFactory: (configRepository: IConfigRepository) =>
        new UpdateConfigService(configRepository),
    },
    {
      inject: [CONFIG_REPOSITORY],
      provide: DELETE_CONFIG_SERVICE,
      useFactory: (configRepository: IConfigRepository) =>
        new DeleteConfigService(configRepository),
    },
    {
      inject: [CONFIG_REPOSITORY],
      provide: GET_CONFIGS_SERVICE,
      useFactory: (configRepository: IConfigRepository) =>
        new GetConfigsService(configRepository),
    },
    {
      inject: [CONFIG_REPOSITORY],
      provide: GET_CONFIG_BY_ID_SERVICE,
      useFactory: (configRepository: IConfigRepository) =>
        new GetConfigByIdService(configRepository),
    },
  ],
  exports: [],
})
export default class ConfigModule {
  constructor() {}
}
