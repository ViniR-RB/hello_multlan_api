import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxModule from '@/modules/box/box.module';
import { BOX_REPOSITORY } from '@/modules/box/symbols';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import AddBoxsToRouteService from '@/modules/routers/application/add_boxs_to_route.service';
import CreateRouteService from '@/modules/routers/application/create_route.service';
import DeleteRouteService from '@/modules/routers/application/delete_route.service';
import FindAllRoutesService from '@/modules/routers/application/find_all_routes.service';
import GetRoutersService from '@/modules/routers/application/get_routers.service';
import RemoveBoxsFromRouteService from '@/modules/routers/application/remove_boxs_from_route.service';
import UpdateRouteService from '@/modules/routers/application/update_route.service';
import RouteController from '@/modules/routers/controller/route.controller';
import RouterModel from '@/modules/routers/infra/models/route.model';
import RouterRepository from '@/modules/routers/infra/repository/router.repository';
import {
  ADD_BOXS_TO_ROUTE_SERVICE,
  CREATE_ROUTE_SERVICE,
  DELETE_ROUTE_SERVICE,
  FIND_ALL_ROUTERS_SERVICE,
  GET_ROUTERS_SERVICE,
  REMOVE_BOXS_FROM_ROUTE_SERVICE,
  ROUTE_REPOSITORY,
  UPDATE_ROUTE_SERVICE,
} from '@/modules/routers/symbols';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Module({
  imports: [
    CoreModule,
    AuthModule,
    BoxModule,
    TypeOrmModule.forFeature([RouterModel]),
  ],
  controllers: [RouteController],
  providers: [
    {
      inject: [getRepositoryToken(RouterModel)],
      provide: ROUTE_REPOSITORY,
      useFactory: (routeRepository: Repository<RouterModel>) =>
        new RouterRepository(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY, BOX_REPOSITORY],
      provide: CREATE_ROUTE_SERVICE,
      useFactory: (
        routeRepository: IRouterRepository,
        boxRepository: IBoxRepository,
      ) => new CreateRouteService(boxRepository, routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: UPDATE_ROUTE_SERVICE,
      useFactory: (routeRepository: IRouterRepository) =>
        new UpdateRouteService(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: DELETE_ROUTE_SERVICE,
      useFactory: (routeRepository: IRouterRepository) =>
        new DeleteRouteService(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY, BOX_REPOSITORY],
      provide: ADD_BOXS_TO_ROUTE_SERVICE,
      useFactory: (
        routeRepository: IRouterRepository,
        boxRepository: IBoxRepository,
      ) => new AddBoxsToRouteService(routeRepository, boxRepository),
    },
    {
      inject: [ROUTE_REPOSITORY, BOX_REPOSITORY],
      provide: REMOVE_BOXS_FROM_ROUTE_SERVICE,
      useFactory: (
        routeRepository: IRouterRepository,
        boxRepository: IBoxRepository,
      ) => new RemoveBoxsFromRouteService(routeRepository, boxRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: GET_ROUTERS_SERVICE,
      useFactory: (routeRepository: IRouterRepository) =>
        new GetRoutersService(routeRepository),
    },
    {
      inject: [ROUTE_REPOSITORY],
      provide: FIND_ALL_ROUTERS_SERVICE,
      useFactory: (routeRepository: IRouterRepository) =>
        new FindAllRoutesService(routeRepository),
    },
  ],
})
export default class RouteModule {}
