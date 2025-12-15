import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import CreateBoxService from '@/modules/box/application/create_box.service';
import DeleteBoxService from '@/modules/box/application/delete_box.service';
import FindAllBoxesService from '@/modules/box/application/find_all_boxes.service';
import GetBoxByIdService from '@/modules/box/application/get_box_by_id.service';
import GetBoxSummaryService from '@/modules/box/application/get_box_summary.service';
import GetBoxesByRouteIdService from '@/modules/box/application/get_boxes_by_route_id.service';
import GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersService from '@/modules/box/application/get_boxes_with_label_and_location_by_lat_long_min_max_and_filters.service';
import GetBoxesWithoutRouteService from '@/modules/box/application/get_boxes_without_route.service';
import UpdateBoxService from '@/modules/box/application/update_box.service';
import BoxController from '@/modules/box/controller/box_controller';
import BoxModel from '@/modules/box/infra/models/box.model';
import BoxRepository from '@/modules/box/infra/repositories/box.repository';
import {
  BOX_REPOSITORY,
  CREATE_BOX_SERVICE,
  DELETE_BOX_SERVICE,
  FIND_ALL_BOXES_SERVICE,
  GET_BOX_BY_ID_SERVICE,
  GET_BOX_SUMMARY_SERVICE,
  GET_BOXES_BY_ROUTE_ID_SERVICE,
  GET_BOXES_WITH_LABEL_AND_LOCATION_BY_LAT_LONG_MIN_MAX_AND_FILTERS,
  GET_BOXES_WITHOUT_ROUTE_SERVICE,
  UPDATE_BOX_SERVICE,
} from '@/modules/box/symbols';
import IImageConverterWebp from '@/modules/file/adapters/i_converter_webp';
import IFileRepository from '@/modules/file/adapters/i_file_repository';
import FileModule from '@/modules/file/file.module';
import {
  FILE_REPOSITORY,
  IMAGE_CONVERTER_WEBP_SERVICE,
} from '@/modules/file/symbols';
import { USER_REPOSITORY } from '@/modules/users/symbols';
import UsersModule from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Module({
  imports: [
    AuthModule,
    CoreModule,
    FileModule,
    UsersModule,
    TypeOrmModule.forFeature([BoxModel]),
  ],
  controllers: [BoxController],
  providers: [
    {
      inject: [getRepositoryToken(BoxModel), DataSource],
      provide: BOX_REPOSITORY,
      useFactory: (
        boxRepository: Repository<BoxModel>,
        dataSource: DataSource,
      ) => new BoxRepository(boxRepository, dataSource),
    },
    {
      inject: [BOX_REPOSITORY, FILE_REPOSITORY, IMAGE_CONVERTER_WEBP_SERVICE],
      provide: CREATE_BOX_SERVICE,
      useFactory: (
        boxRepository: BoxRepository,
        fileRepository: IFileRepository,
        imageConverterWebp: IImageConverterWebp,
      ) =>
        new CreateBoxService(boxRepository, fileRepository, imageConverterWebp),
    },
    {
      inject: [BOX_REPOSITORY, FILE_REPOSITORY],
      provide: UPDATE_BOX_SERVICE,
      useFactory: (
        boxRepository: IBoxRepository,
        fileRepository: IFileRepository,
      ) => new UpdateBoxService(boxRepository, fileRepository),
    },

    {
      inject: [BOX_REPOSITORY],
      provide: GET_BOX_BY_ID_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxByIdService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: FIND_ALL_BOXES_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new FindAllBoxesService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_BOX_SUMMARY_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxSummaryService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide:
        GET_BOXES_WITH_LABEL_AND_LOCATION_BY_LAT_LONG_MIN_MAX_AND_FILTERS,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersService(
          boxRepository,
        ),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_BOXES_BY_ROUTE_ID_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxesByRouteIdService(boxRepository),
    },
    {
      inject: [BOX_REPOSITORY],
      provide: GET_BOXES_WITHOUT_ROUTE_SERVICE,
      useFactory: (boxRepository: IBoxRepository) =>
        new GetBoxesWithoutRouteService(boxRepository),
    },
    {
      inject: [USER_REPOSITORY, BOX_REPOSITORY],
      provide: DELETE_BOX_SERVICE,
      useFactory: (userRepository, boxRepository) =>
        new DeleteBoxService(userRepository, boxRepository),
    },
  ],
  exports: [
    {
      inject: [getRepositoryToken(BoxModel), DataSource],
      provide: BOX_REPOSITORY,
      useFactory: (
        boxRepository: Repository<BoxModel>,
        dataSource: DataSource,
      ) => new BoxRepository(boxRepository, dataSource),
    },
  ],
})
export default class BoxModule {
  constructor() {}
}
