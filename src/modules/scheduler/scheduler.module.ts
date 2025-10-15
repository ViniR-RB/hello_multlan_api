import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxModule from '@/modules/box/box.module';
import { BOX_REPOSITORY } from '@/modules/box/symbols';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import GetConfigByKeyService from '@/modules/config/application/get_config_by_key.service';
import ConfigModule from '@/modules/config/config.module';
import { CONFIG_REPOSITORY } from '@/modules/config/symbols';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import CountOccurrencesByTypeService from '@/modules/occurence/application/count_occurrences_by_type.service';
import OccurrenceModule from '@/modules/occurence/occurrence.module';
import { OCCURRENCE_REPOSITORY } from '@/modules/occurence/symbols';
import BoxZoneSchedulerService from '@/modules/scheduler/box_zone_scheduler.service';
import {
  COUNT_OCCURRENCES_BY_TYPE_SERVICE,
  GET_CONFIG_BY_KEY_SERVICE,
} from '@/modules/scheduler/symbols';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    OccurrenceModule,
    BoxModule,
  ],
  providers: [
    {
      inject: [CONFIG_REPOSITORY],
      provide: GET_CONFIG_BY_KEY_SERVICE,
      useFactory: (configRepository: IConfigRepository) =>
        new GetConfigByKeyService(configRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: COUNT_OCCURRENCES_BY_TYPE_SERVICE,
      useFactory: (occurrenceRepository: IOcurrenceRepository) =>
        new CountOccurrencesByTypeService(occurrenceRepository),
    },
    {
      inject: [
        GET_CONFIG_BY_KEY_SERVICE,
        COUNT_OCCURRENCES_BY_TYPE_SERVICE,
        BOX_REPOSITORY,
        OCCURRENCE_REPOSITORY,
      ],
      provide: BoxZoneSchedulerService,
      useFactory: (
        getConfigByKeyService: GetConfigByKeyService,
        countOccurrencesService: CountOccurrencesByTypeService,
        boxRepository: IBoxRepository,
        occurrenceRepository: IOcurrenceRepository,
      ) =>
        new BoxZoneSchedulerService(
          getConfigByKeyService,
          countOccurrencesService,
          boxRepository,
          occurrenceRepository,
        ),
    },
  ],
  exports: [],
})
export default class SchedulerModule {}
