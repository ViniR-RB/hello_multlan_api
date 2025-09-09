import CoreModule from '@/core/core_module';
import AuthModule from '@/modules/auth/auth.module';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxModule from '@/modules/box/box.module';
import { BOX_REPOSITORY } from '@/modules/box/symbols';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import CreateRouteService from '@/modules/routers/application/create_route.service';
import RouteController from '@/modules/routers/controller/route.controller';
import RouterModel from '@/modules/routers/infra/models/route.model';
import RouterRepository from '@/modules/routers/infra/repository/router.repository';
import {
  CREATE_ROUTE_SERVICE,
  ROUTE_REPOSITORY,
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
  ],
})
export default class RouteModule {}
