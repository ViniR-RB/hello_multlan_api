import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxModule from '@/modules/box/box.module';
import { BOX_REPOSITORY } from '@/modules/box/symbols';
import { IEventBus } from '@/modules/events/adapters/i_event_bus';
import EventsModule from '@/modules/events/events.module';
import { EVENT_BUS } from '@/modules/events/symbols';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import CreateOcurrenceService from '@/modules/occurence/application/create_ocurrence.service';
import OccurrenceController from '@/modules/occurence/controller/occurrence.controller';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import OccurrenceRepository from '@/modules/occurence/infra/repository/occurence.repository';
import {
  CREATE_OCCURRENCE_SERVICE,
  OCCURRENCE_REPOSITORY,
} from '@/modules/occurence/symbols';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import { USER_REPOSITORY } from '@/modules/users/symbols';
import UsersModule from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    BoxModule,
    UsersModule,
    EventsModule,
    TypeOrmModule.forFeature([OccurrenceModel]),
  ],
  controllers: [OccurrenceController],
  providers: [
    {
      inject: [getRepositoryToken(OccurrenceModel)],
      provide: OCCURRENCE_REPOSITORY,
      useFactory: repository => new OccurrenceRepository(repository),
    },
    {
      inject: [
        OCCURRENCE_REPOSITORY,
        USER_REPOSITORY,
        BOX_REPOSITORY,
        EVENT_BUS,
      ],
      provide: CREATE_OCCURRENCE_SERVICE,
      useFactory: (
        ocurrenceRepository: IOcurrenceRepository,
        userRepository: IUserRepository,
        boxRepository: IBoxRepository,
        eventBus: IEventBus,
      ) =>
        new CreateOcurrenceService(
          ocurrenceRepository,
          userRepository,
          boxRepository,
          eventBus,
        ),
    },
  ],
  exports: [],
})
export default class OccurrenceModule {
  constructor() {}
}
