import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxModule from '@/modules/box/box.module';
import { BOX_REPOSITORY } from '@/modules/box/symbols';
import { IEventBus } from '@/modules/events/adapters/i_event_bus';
import EventsModule from '@/modules/events/events.module';
import { EVENT_BUS } from '@/modules/events/symbols';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import ApproveOccurrenceService from '@/modules/occurence/application/approve_occurrence.service';
import CancelOccurrenceService from '@/modules/occurence/application/cancel_occurrence.service';
import CountOccurrencesByTypeService from '@/modules/occurence/application/count_occurrences_by_type.service';
import CreateOccurrenceTypeService from '@/modules/occurence/application/create_occurrence_type.service';
import CreateOcurrenceService from '@/modules/occurence/application/create_ocurrence.service';
import DeleteOccurrenceTypeService from '@/modules/occurence/application/delete_occurrence_type.service';
import GetOccurrenceTypeByIdService from '@/modules/occurence/application/get_occurrence_type_by_id.service';
import GetOccurrenceTypesService from '@/modules/occurence/application/get_occurrence_types.service';
import GetOccurrencesService from '@/modules/occurence/application/get_occurrences.service';
import UpdateOccurrenceTypeService from '@/modules/occurence/application/update_occurrence_type.service';
import OccurrenceController from '@/modules/occurence/controller/occurrence.controller';
import OccurrenceTypeController from '@/modules/occurence/controller/occurrence_type.controller';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import OccurrenceTypeModel from '@/modules/occurence/infra/models/occurrence_type.model';
import OccurrenceRepository from '@/modules/occurence/infra/repository/occurence.repository';
import OccurrenceTypeRepository from '@/modules/occurence/infra/repository/occurrence_type.repository';
import {
  APPROVE_OCCURRENCE_SERVICE,
  CANCEL_OCCURRENCE_SERVICE,
  COUNT_OCCURRENCES_BY_TYPE_SERVICE,
  CREATE_OCCURRENCE_SERVICE,
  CREATE_OCCURRENCE_TYPE_SERVICE,
  DELETE_OCCURRENCE_TYPE_SERVICE,
  GET_OCCURRENCE_SERVICE,
  GET_OCCURRENCE_TYPE_BY_ID_SERVICE,
  GET_OCCURRENCE_TYPES_SERVICE,
  OCCURRENCE_REPOSITORY,
  OCCURRENCE_TYPE_REPOSITORY,
  UPDATE_OCCURRENCE_TYPE_SERVICE,
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
    TypeOrmModule.forFeature([OccurrenceModel, OccurrenceTypeModel]),
  ],
  controllers: [OccurrenceController, OccurrenceTypeController],
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
    // Occurrence Type Providers
    {
      inject: [getRepositoryToken(OccurrenceTypeModel)],
      provide: OCCURRENCE_TYPE_REPOSITORY,
      useFactory: repository => new OccurrenceTypeRepository(repository),
    },
    {
      inject: [OCCURRENCE_TYPE_REPOSITORY],
      provide: CREATE_OCCURRENCE_TYPE_SERVICE,
      useFactory: (occurrenceTypeRepository: IOccurrenceTypeRepository) =>
        new CreateOccurrenceTypeService(occurrenceTypeRepository),
    },
    {
      inject: [OCCURRENCE_TYPE_REPOSITORY],
      provide: UPDATE_OCCURRENCE_TYPE_SERVICE,
      useFactory: (occurrenceTypeRepository: IOccurrenceTypeRepository) =>
        new UpdateOccurrenceTypeService(occurrenceTypeRepository),
    },
    {
      inject: [OCCURRENCE_TYPE_REPOSITORY],
      provide: DELETE_OCCURRENCE_TYPE_SERVICE,
      useFactory: (occurrenceTypeRepository: IOccurrenceTypeRepository) =>
        new DeleteOccurrenceTypeService(occurrenceTypeRepository),
    },
    {
      inject: [OCCURRENCE_TYPE_REPOSITORY],
      provide: GET_OCCURRENCE_TYPES_SERVICE,
      useFactory: (occurrenceTypeRepository: IOccurrenceTypeRepository) =>
        new GetOccurrenceTypesService(occurrenceTypeRepository),
    },
    {
      inject: [OCCURRENCE_TYPE_REPOSITORY],
      provide: GET_OCCURRENCE_TYPE_BY_ID_SERVICE,
      useFactory: (occurrenceTypeRepository: IOccurrenceTypeRepository) =>
        new GetOccurrenceTypeByIdService(occurrenceTypeRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: COUNT_OCCURRENCES_BY_TYPE_SERVICE,
      useFactory: (occurrenceRepository: IOcurrenceRepository) =>
        new CountOccurrencesByTypeService(occurrenceRepository),
    },
  ],
  exports: [OCCURRENCE_REPOSITORY, COUNT_OCCURRENCES_BY_TYPE_SERVICE],
})
export default class OccurrenceModule {
  constructor() {}
}
