import IAddBoxForRouteUseCase, {
  AddBoxForParam,
} from '@/modules/box/domain/usecases/i_add_box_for_route_use_case';
import ICreateRouteUseCase, {
  CreateRouteParam,
} from '@/modules/box/domain/usecases/i_create_route_use_case';
import IDeleteRouteByIdUseCase from '@/modules/box/domain/usecases/i_delete_route_by_id_use_case';
import IGetAllRoutedUseCase from '@/modules/box/domain/usecases/i_get_all_route_use_case';
import IGetRouteByIdUseCase, {
  GetRouteByIdUseCaseParam,
} from '@/modules/box/domain/usecases/i_get_route_by_id_use_case';
import IRemoveBoxRouteUseCase, {
  RemoveBoxRouteParam,
} from '@/modules/box/domain/usecases/i_remove_box_route_use_case';
import CreateRouteDto from '@/modules/box/dtos/create_route.dto';
import {
  ADD_BOX_FOR_ROUTE_SERVICE,
  CREATE_ROUTE_BOX_SERVICE,
  DELETE_ROUTE_BY_ID_SERVICE,
  GET_ALL_ROUTE_SERVICE,
  GET_ROUTE_BY_ID_SERVICE,
  REMOVE_BOX_FOR_ROUTE_SERVICE,
} from '@/modules/box/symbols';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller('/api/route')
@UseGuards(AuthGuard)
export default class RouteController {
  constructor(
    @Inject(GET_ALL_ROUTE_SERVICE)
    private readonly getAllRouteService: IGetAllRoutedUseCase,
    @Inject(CREATE_ROUTE_BOX_SERVICE)
    private readonly createRouteSerivce: ICreateRouteUseCase,
    @Inject(GET_ROUTE_BY_ID_SERVICE)
    private readonly getRouteByIdService: IGetRouteByIdUseCase,
    @Inject(REMOVE_BOX_FOR_ROUTE_SERVICE)
    private readonly removeBoxForRouteService: IRemoveBoxRouteUseCase,
    @Inject(ADD_BOX_FOR_ROUTE_SERVICE)
    private readonly addBoxForRouteService: IAddBoxForRouteUseCase,
    @Inject(DELETE_ROUTE_BY_ID_SERVICE)
    private readonly deleteRouteByIdService: IDeleteRouteByIdUseCase,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createRoute(@Body() data: CreateRouteDto) {
    const createRouteParam = new CreateRouteParam(
      data.boxes.map(box => box.id),
    );

    const result = await this.createRouteSerivce.execute(createRouteParam);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getRoute(@Param('id', ParseUUIDPipe) id: string) {
    const getRouteByIdParam = plainToClass(GetRouteByIdUseCaseParam, {
      id,
    });

    const result = await this.getRouteByIdService.execute(getRouteByIdParam);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value;
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllRoutes() {
    const result = await this.getAllRouteService.execute();

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value;
  }

  @Put(':id/remove-box')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeBoxFromRoute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('boxId', ParseUUIDPipe) boxId: string,
  ) {
    const removeBoxParam = plainToClass(RemoveBoxRouteParam, {
      routeId: id,
      boxId,
    });

    const result = await this.removeBoxForRouteService.execute(removeBoxParam);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value;
  }

  @Put(':id/add-box')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addBoxForRoute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('boxId', ParseUUIDPipe) boxId: string,
  ) {
    const addBoxForRouteParam = new AddBoxForParam(id, boxId);

    const result =
      await this.addBoxForRouteService.execute(addBoxForRouteParam);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRouteById(@Param('id', ParseUUIDPipe) id: string) {
    const deleteRouteByIdParam = new GetRouteByIdUseCaseParam(id);

    const result =
      await this.deleteRouteByIdService.execute(deleteRouteByIdParam);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value;
  }
}
