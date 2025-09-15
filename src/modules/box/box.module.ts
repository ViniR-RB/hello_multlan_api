import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import CreateBoxService from '@/modules/box/application/create_box.service';
import GetBoxByIdService from '@/modules/box/application/get_box_by_id.service';
import GetBoxesWithLabelAndLocationService from '@/modules/box/application/get_boxes_with_label_and_location.service';
import UpdateBoxService from '@/modules/box/application/update_box.service';
import BoxController from '@/modules/box/controller/box_controller';
import BoxModel from '@/modules/box/infra/models/box.model';
import BoxRepository from '@/modules/box/infra/repositories/box.repository';
import {
  BOX_REPOSITORY,
  CREATE_BOX_SERVICE,
  GET_BOX_BY_ID_SERVICE,
  GET_BOXES_WITH_LOCATION_AND_LABEL_SERVICE,
  UPDATE_BOX_SERVICE,
} from '@/modules/box/symbols';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import FileModule from '@/modules/file/file.module';
import { FILE_REPOSITORY } from '@/modules/file/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    FileModule,
    TypeOrmModule.forFeature([BoxModel]),
  ],
  controllers: [BoxController],
  providers: [
    {
      inject: [getRepositoryToken(BoxModel)],
      provide: BOX_REPOSITORY,
      useFactory: (boxRepository: Repository<BoxModel>) =>
        new BoxRepository(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY, FILE_REPOSITORY],
      provide: CREATE_BOX_SERVICE,
      useFactory: (
        boxRepository: BoxRepository,
        fileRepository: IFileRepository,
      ) => new CreateBoxService(boxRepository, fileRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: UPDATE_BOX_SERVICE,
      useFactory: (boxRepository: BoxRepository) =>
        new UpdateBoxService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_BOXES_WITH_LOCATION_AND_LABEL_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxesWithLabelAndLocationService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_BOX_BY_ID_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxByIdService(boxRepository),
    },
  ],
  exports: [
    {
      inject: [getRepositoryToken(BoxModel)],
      provide: BOX_REPOSITORY,
      useFactory: (boxRepository: Repository<BoxModel>) =>
        new BoxRepository(boxRepository),
    },
  ],
})
export default class BoxModule {
  constructor() {}
}
