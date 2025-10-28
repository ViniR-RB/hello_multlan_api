import AuthGuard from '@/core/guard/auth.guard';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
import IAddBoxsToRouteUseCase from '@/modules/routers/domain/usecase/i_add_boxs_to_route_use_case';
import ICreateRouteUseCase from '@/modules/routers/domain/usecase/i_create_route_use_case';
import IDeleteRouteUseCase from '@/modules/routers/domain/usecase/i_delete_route_use_case';
import IFindAllRoutesUseCase from '@/modules/routers/domain/usecase/i_find_all_routes_use_case';
import IGetRoutersUseCase from '@/modules/routers/domain/usecase/i_get_routers_use_case';
import IRemoveBoxsFromRouteUseCase from '@/modules/routers/domain/usecase/i_remove_boxs_from_route_use_case';
import IUpdateRouteUseCase from '@/modules/routers/domain/usecase/i_update_route_use_case';
import AddBoxsToRouteDto from '@/modules/routers/dto/add_boxs_to_route.dto';
import CreateRouterDto from '@/modules/routers/dto/create_route.dto';
import RemoveBoxsFromRouteDto from '@/modules/routers/dto/remove_boxs_from_route.dto';
import RouterFilterDto from '@/modules/routers/dto/router_filter.dto';
import UpdateRouteDto from '@/modules/routers/dto/update_route.dto';
import {
  ADD_BOXS_TO_ROUTE_SERVICE,
  CREATE_ROUTE_SERVICE,
  DELETE_ROUTE_SERVICE,
  FIND_ALL_ROUTERS_SERVICE,
  GET_ROUTERS_SERVICE,
  REMOVE_BOXS_FROM_ROUTE_SERVICE,
  UPDATE_ROUTE_SERVICE,
} from '@/modules/routers/symbols';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('api/route')
@UseGuards(AuthGuard)
export default class RouteController {
  constructor(
    @Inject(CREATE_ROUTE_SERVICE)
    private readonly createRouteService: ICreateRouteUseCase,
    @Inject(UPDATE_ROUTE_SERVICE)
    private readonly updateRouteService: IUpdateRouteUseCase,
    @Inject(DELETE_ROUTE_SERVICE)
    private readonly deleteRouteService: IDeleteRouteUseCase,
    @Inject(ADD_BOXS_TO_ROUTE_SERVICE)
    private readonly addBoxsToRouteService: IAddBoxsToRouteUseCase,
    @Inject(REMOVE_BOXS_FROM_ROUTE_SERVICE)
    private readonly removeBoxsFromRouteService: IRemoveBoxsFromRouteUseCase,
    @Inject(GET_ROUTERS_SERVICE)
    private readonly getRoutersService: IGetRoutersUseCase,
    @Inject(FIND_ALL_ROUTERS_SERVICE)
    private readonly findAllRoutesService: IFindAllRoutesUseCase,
  ) {}

  @Get('/all')
  async findAllRoutes() {
    const result = await this.findAllRoutesService.execute();

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Get('')
  async getRouters(
    @Query() query: PageOptionsDto,
    @Query() routerFilter: RouterFilterDto,
  ) {
    const result = await this.getRoutersService.execute({
      pageOptions: new PageOptionsEntity(query.order, query.page, query.take),
      boxId: routerFilter.boxId,
      routerId: routerFilter.routerId,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Post('')
  async createRoute(@Body() createRouteDto: CreateRouterDto) {
    const result = await this.createRouteService.execute({
      boxs: createRouteDto.boxes,
      name: createRouteDto.name,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Put(':routeId/update')
  async updateRoute(
    @Param('routeId', ParseUUIDPipe) routeId: string,
    @Body() body: UpdateRouteDto,
  ) {
    const result = await this.updateRouteService.execute({
      routeId,
      name: body.name,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Put(':routeId/add-boxs')
  async addBoxsToRoute(
    @Param('routeId', ParseUUIDPipe) routeId: string,
    @Body() body: AddBoxsToRouteDto,
  ) {
    const result = await this.addBoxsToRouteService.execute({
      boxIds: body.boxIds,
      routeId,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Put(':routeId/remove-boxs')
  async removeBoxsFromRoute(
    @Param('routeId', ParseUUIDPipe) routeId: string,
    @Body() body: RemoveBoxsFromRouteDto,
  ) {
    const result = await this.removeBoxsFromRouteService.execute({
      boxIds: body.boxIds,
      routeId,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Delete(':routeId')
  async deleteRoute(@Param('routeId', ParseUUIDPipe) routeId: string) {
    const result = await this.deleteRouteService.execute({ routeId });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
}
