import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IBoxRepository from './adapters/i_box_repository';
import CreateBoxService from './application/create_box.service';
import GetAllBoxService from './application/get_all_box.service';
import BoxController from './controller/box.controller';
import BoxModel from './infra/model/box.model';
import BoxRepository from './infra/repository/box.repository';
import {
  BOX_REPOSITORY,
  CREATE_BOX_SERVICE,
  GET_ALL_BOXS_SERVICE,
} from './symbols';

@Module({
  imports: [TypeOrmModule.forFeature([BoxModel])],
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
      inject: [getRepositoryToken(BoxModel)],
      provide: BOX_REPOSITORY,
      useFactory: (boxRepository: Repository<BoxModel>) => {
        return new BoxRepository(boxRepository);
      },
    },
  ],
  exports: [],
})
export default class BoxModule {}
