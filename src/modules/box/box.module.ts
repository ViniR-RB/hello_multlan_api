import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core_module';
import { Repository } from 'typeorm';
import IUploadFile from '../upload/domain/usecase/i_upload_file';
import { UPLOAD_FILE } from '../upload/symbols';
import UploadModule from '../upload/upload.module';
import IBoxRepository from './adapters/i_box_repository';
import IImageProcessingService from './adapters/i_image_processing.service';
import CreateBoxService from './application/create_box.service';
import DeleteBoxService from './application/delete_box.service';
import GetAllBoxService from './application/get_all_box.service';
import GetSummaryBoxService from './application/get_summary_box.service';
import UpdateBoxService from './application/update_box.service';
import BoxController from './controller/box.controller';
import BoxModel from './infra/model/box.model';
import BoxRepository from './infra/repository/box.repository';
import { ImageProcessingService } from './infra/services/image_processing.service';
import {
  BOX_REPOSITORY,
  CREATE_BOX_SERVICE,
  DELETE_BOX,
  GET_ALL_BOXS_SERVICE,
  GET_SUMMARY_BOX,
  IMAGE_PROCESSING_SERVICE,
  UPDATE_BOX_SERVICE,
} from './symbols';

@Module({
  imports: [TypeOrmModule.forFeature([BoxModel]), UploadModule, CoreModule],
  controllers: [BoxController],
  providers: [
    {
      inject: [BOX_REPOSITORY, IMAGE_PROCESSING_SERVICE, UPLOAD_FILE],
      provide: CREATE_BOX_SERVICE,
      useFactory: (
        boxRepository: IBoxRepository,
        imageProcessing: IImageProcessingService,
        uploadFile: IUploadFile,
      ) => {
        return new CreateBoxService(boxRepository, imageProcessing, uploadFile);
      },
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_ALL_BOXS_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetAllBoxService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: UPDATE_BOX_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new UpdateBoxService(boxRepository),
    },
    {
      inject: [getRepositoryToken(BoxModel)],
      provide: BOX_REPOSITORY,
      useFactory: (boxRepository: Repository<BoxModel>) => {
        return new BoxRepository(boxRepository);
      },
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_SUMMARY_BOX,
      useFactory: (boxRepository: IBoxRepository) => {
        return new GetSummaryBoxService(boxRepository);
      },
    },
    {
      inject: [BOX_REPOSITORY],
      provide: DELETE_BOX,
      useFactory: (boxRepository: IBoxRepository) => {
        return new DeleteBoxService(boxRepository);
      },
    },
    {
      provide: IMAGE_PROCESSING_SERVICE,
      useFactory: () => {
        return new ImageProcessingService();
      },
    },
  ],
  exports: [],
})
export default class BoxModule {}
