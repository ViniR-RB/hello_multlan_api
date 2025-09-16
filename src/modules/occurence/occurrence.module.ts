import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxModule from '@/modules/box/box.module';
import { BOX_REPOSITORY } from '@/modules/box/symbols';
import { IEventBus } from '@/modules/events/adapters/i_event_bus';
import EventsModule from '@/modules/events/events.module';
import { EVENT_BUS } from '@/modules/events/symbols';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import ApproveOccurrenceService from '@/modules/occurence/application/approve_occurrence.service';
import CancelOccurrenceService from '@/modules/occurence/application/cancel_occurrence.service';
import CreateOcurrenceService from '@/modules/occurence/application/create_ocurrence.service';
import GetOccurrencesService from '@/modules/occurence/application/get_occurrences.service';
import OccurrenceController from '@/modules/occurence/controller/occurrence.controller';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import OccurrenceRepository from '@/modules/occurence/infra/repository/occurence.repository';
import {
  APPROVE_OCCURRENCE_SERVICE,
  CANCEL_OCCURRENCE_SERVICE,
  CREATE_OCCURRENCE_SERVICE,
  GET_OCCURRENCE_SERVICE,
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
    AuthModule,
    CoreModule,
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
    {
      inject: [USER_REPOSITORY, OCCURRENCE_REPOSITORY],
      provide: CANCEL_OCCURRENCE_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        ocurrenceRepository: IOcurrenceRepository,
      ) => new CancelOccurrenceService(ocurrenceRepository, userRepository),
    },
    {
      inject: [USER_REPOSITORY, OCCURRENCE_REPOSITORY],
      provide: APPROVE_OCCURRENCE_SERVICE,
      useFactory: (
        userRepository: IUserRepository,
        ocurrenceRepository: IOcurrenceRepository,
      ) => new ApproveOccurrenceService(ocurrenceRepository, userRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: GET_OCCURRENCE_SERVICE,
      useFactory: (ocurrenceRepository: IOcurrenceRepository) =>
        new GetOccurrencesService(ocurrenceRepository),
    },
  ],
  exports: [],
})
export default class OccurrenceModule {
  constructor() {}
}
