import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import AddBoxForRouteService from '@/modules/box/application/add_box_for_route.service';
import CreateRouteService from '@/modules/box/application/create_route.service';
import DeleteByIdRouteService from '@/modules/box/application/delete_route_by_id.service';
import GetAllRouteService from '@/modules/box/application/get_all_route.service';
import GetRouteByIdService from '@/modules/box/application/get_route_by_id.service';
import RemoveBoxRouteService from '@/modules/box/application/remove_box_route.service';
import RouteController from '@/modules/box/controller/route.controller';
import RouteModel from '@/modules/box/infra/model/route.model';
import RouteRepository from '@/modules/box/infra/repository/route.repository';
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
  ADD_BOX_FOR_ROUTE_SERVICE,
  BOX_REPOSITORY,
  CREATE_BOX_SERVICE,
  CREATE_ROUTE_BOX_SERVICE,
  DELETE_BOX,
  DELETE_ROUTE_BY_ID_SERVICE,
  GET_ALL_BOXS_SERVICE,
  GET_ALL_ROUTE_SERVICE,
  GET_ROUTE_BY_ID_SERVICE,
  GET_SUMMARY_BOX,
  IMAGE_PROCESSING_SERVICE,
  REMOVE_BOX_FOR_ROUTE_SERVICE,
  ROUTE_REPOSITORY,
  UPDATE_BOX_SERVICE,
} from './symbols';
import AuthModule from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoxModel, RouteModel]),
    UploadModule,
    CoreModule,
    AuthModule,
  ],
  controllers: [BoxController, RouteController],
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
    {
      inject: [getRepositoryToken(RouteModel)],
      provide: ROUTE_REPOSITORY,
      useFactory: (routeRepository: Repository<RouteModel>) => {
        return new RouteRepository(routeRepository);
      },
    },
    {
      inject: [ROUTE_REPOSITORY, BOX_REPOSITORY],
      provide: CREATE_ROUTE_BOX_SERVICE,
      useFactory: (
        routeRepository: IRouteRepository,
        boxRepository: IBoxRepository,
      ) => new CreateRouteService(routeRepository, boxRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: GET_ROUTE_BY_ID_SERVICE,
      useFactory: (routeRepository: IRouteRepository) =>
        new GetRouteByIdService(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: REMOVE_BOX_FOR_ROUTE_SERVICE,
      useFactory: (routeRepository: IRouteRepository) =>
        new RemoveBoxRouteService(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY, BOX_REPOSITORY],
      provide: ADD_BOX_FOR_ROUTE_SERVICE,
      useFactory: (
        routeRepository: IRouteRepository,
        boxRepository: IBoxRepository,
      ) => new AddBoxForRouteService(routeRepository, boxRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: DELETE_ROUTE_BY_ID_SERVICE,
      useFactory: (routeRepository: IRouteRepository) =>
        new DeleteByIdRouteService(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: GET_ALL_ROUTE_SERVICE,
      useFactory: (routeRepository: IRouteRepository) =>
        new GetAllRouteService(routeRepository),
    },
  ],
  exports: [],
})
export default class BoxModule {}
