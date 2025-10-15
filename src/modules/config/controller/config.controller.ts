import { Roles } from '@/core/decorators/role.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import ICreateConfigUseCase from '@/modules/config/domain/usecases/i_create_config_use_case';
import IDeleteConfigUseCase from '@/modules/config/domain/usecases/i_delete_config_use_case';
import IGetConfigByIdUseCase from '@/modules/config/domain/usecases/i_get_config_by_id_use_case';
import IGetConfigsUseCase from '@/modules/config/domain/usecases/i_get_configs_use_case';
import IUpdateConfigUseCase from '@/modules/config/domain/usecases/i_update_config_use_case';
import CreateConfigDto from '@/modules/config/dto/create_config.dto';
import UpdateConfigDto from '@/modules/config/dto/update_config.dto';
import {
  CREATE_CONFIG_SERVICE,
  DELETE_CONFIG_SERVICE,
  GET_CONFIGS_SERVICE,
  GET_CONFIG_BY_ID_SERVICE,
  UPDATE_CONFIG_SERVICE,
} from '@/modules/config/symbols';

import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
import UserRole from '@/modules/users/domain/entities/user_role';
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
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('api/configs')
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN)
export default class ConfigController {
  constructor(
    @Inject(CREATE_CONFIG_SERVICE)
    private readonly createConfigUseCase: ICreateConfigUseCase,
    @Inject(UPDATE_CONFIG_SERVICE)
    private readonly updateConfigUseCase: IUpdateConfigUseCase,
    @Inject(DELETE_CONFIG_SERVICE)
    private readonly deleteConfigUseCase: IDeleteConfigUseCase,
    @Inject(GET_CONFIGS_SERVICE)
    private readonly getConfigsUseCase: IGetConfigsUseCase,
    @Inject(GET_CONFIG_BY_ID_SERVICE)
    private readonly getConfigByIdUseCase: IGetConfigByIdUseCase,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createConfig(@Body() dto: CreateConfigDto) {
    const result = await this.createConfigUseCase.execute({
      key: dto.key,
      value: dto.value,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getConfigs(@Query() query: PageOptionsDto) {
    const result = await this.getConfigsUseCase.execute({
      pageOptions: new PageOptionsEntity(query.order, query.page, query.take),
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getConfigById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.getConfigByIdUseCase.execute({ id });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateConfig(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateConfigDto,
  ) {
    const result = await this.updateConfigUseCase.execute({
      id,
      value: dto.value,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteConfig(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.deleteConfigUseCase.execute({ id });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
}
