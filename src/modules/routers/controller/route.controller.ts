import AuthGuard from '@/core/guard/auth.guard';
import ICreateRouteUseCase from '@/modules/routers/domain/usecase/i_create_route_use_case';
import CreateRouterDto from '@/modules/routers/dto/create_route.dto';
import { CREATE_ROUTE_SERVICE } from '@/modules/routers/symbols';
import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('api/route')
@UseGuards(AuthGuard)
export default class RouteController {
  constructor(
    @Inject(CREATE_ROUTE_SERVICE)
    private readonly createRouteService: ICreateRouteUseCase,
  ) {}

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
}
