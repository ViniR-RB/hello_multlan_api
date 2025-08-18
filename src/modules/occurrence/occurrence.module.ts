import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core_module';
import { Repository } from 'typeorm';

import IOccurrenceRepository from './adapters/i_occurrence_repository';
import OccurrenceController from './controller/occurrence.controller';
import OccurrenceModel from './infra/model/occurrence.model';
import OccurrenceRepository from './infra/repository/occurrence.repository';

import AssignOccurrenceService from './application/assign_occurrence.service';
import CancelOccurrenceService from './application/cancel_occurrence.service';
import CloseOccurrenceService from './application/close_occurrence.service';
import CreateOccurrenceService from './application/create_occurrence.service';
import GetAllOccurrencesService from './application/get_all_occurrences.service';
import GetOccurrenceByIdService from './application/get_occurrence_by_id.service';
import GetOccurrencesByBoxService from './application/get_occurrences_by_box.service';
import UpdateOccurrenceService from './application/update_occurrence.service';

import {
  ASSIGN_OCCURRENCE_SERVICE,
  CANCEL_OCCURRENCE_SERVICE,
  CLOSE_OCCURRENCE_SERVICE,
  CREATE_OCCURRENCE_SERVICE,
  GET_ALL_OCCURRENCES_SERVICE,
  GET_OCCURRENCES_BY_BOX_SERVICE,
  GET_OCCURRENCE_BY_ID_SERVICE,
  OCCURRENCE_REPOSITORY,
  UPDATE_OCCURRENCE_SERVICE,
} from './symbols';

// Import user module dependencies
import { FirebaseNotificationService } from 'src/core/services/firebase-notification.service';
import IUserRepository from 'src/modules/user/adapters/i_user_repository';
import UserModel from 'src/modules/user/infra/model/user.model';
import UserRepository from 'src/modules/user/infra/user.repository';
import AuthModule from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OccurrenceModel, UserModel]),
    CoreModule,
    AuthModule,
  ],
  controllers: [OccurrenceController],
  providers: [
    {
      inject: [getRepositoryToken(OccurrenceModel)],
      provide: OCCURRENCE_REPOSITORY,
      useFactory: (occurrenceRepository: Repository<OccurrenceModel>) => {
        return new OccurrenceRepository(occurrenceRepository);
      },
    },
    {
      inject: [getRepositoryToken(UserModel)],
      provide: 'USER_REPOSITORY',
      useFactory: (userRepository: Repository<UserModel>) => {
        return new UserRepository(userRepository);
      },
    },
    {
      inject: [
        OCCURRENCE_REPOSITORY,
        'USER_REPOSITORY',
        FirebaseNotificationService,
      ],
      provide: CREATE_OCCURRENCE_SERVICE,
      useFactory: (
        occurrenceRepository: IOccurrenceRepository,
        userRepository: IUserRepository,
        notificationService: FirebaseNotificationService,
      ) =>
        new CreateOccurrenceService(
          occurrenceRepository,
          userRepository,
          notificationService,
        ),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: GET_ALL_OCCURRENCES_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new GetAllOccurrencesService(occurrenceRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: GET_OCCURRENCE_BY_ID_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new GetOccurrenceByIdService(occurrenceRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: UPDATE_OCCURRENCE_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new UpdateOccurrenceService(occurrenceRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: ASSIGN_OCCURRENCE_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new AssignOccurrenceService(occurrenceRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: CLOSE_OCCURRENCE_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new CloseOccurrenceService(occurrenceRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: CANCEL_OCCURRENCE_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new CancelOccurrenceService(occurrenceRepository),
    },
    {
      inject: [OCCURRENCE_REPOSITORY],
      provide: GET_OCCURRENCES_BY_BOX_SERVICE,
      useFactory: (occurrenceRepository: IOccurrenceRepository) =>
        new GetOccurrencesByBoxService(occurrenceRepository),
    },
  ],
  exports: [],
})
export default class OccurrenceModule {}
