import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core_module';
import { Repository } from 'typeorm';
import UploadModule from '../upload/upload.module';
import IBoxRepository from './adapters/i_box_repository';
import CreateBoxService from './application/create_box.service';
import GetAllBoxService from './application/get_all_box.service';
import UpdateBoxService from './application/update_box.service';
import BoxController from './controller/box.controller';
import BoxModel from './infra/model/box.model';
import BoxRepository from './infra/repository/box.repository';
import {
  BOX_REPOSITORY,
  CREATE_BOX_SERVICE,
  GET_ALL_BOXS_SERVICE,
  GET_SUMMARY_BOX,
  UPDATE_BOX_SERVICE,
} from './symbols';
import GetSummaryBoxService from './application/get_summary_box.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoxModel]), UploadModule, CoreModule],
  controllers: [BoxController],
  providers: [
    {
      inject: [BOX_REPOSITORY],
      provide: CREATE_BOX_SERVICE,
      useFactory: (boxRepository: IBoxRepository) => {
        return new CreateBoxService(boxRepository);
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
  ],
  exports: [],
})
export default class BoxModule {}
