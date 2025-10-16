import AuthGuard from '@/core/guard/auth.guard';
import ICreateOccurrenceTypeUseCase from '@/modules/occurence/domain/usecases/i_create_occurrence_type_use_case';
import IDeleteOccurrenceTypeUseCase from '@/modules/occurence/domain/usecases/i_delete_occurrence_type_use_case';
import IGetOccurrenceTypeByIdUseCase from '@/modules/occurence/domain/usecases/i_get_occurrence_type_by_id_use_case';
import IGetOccurrenceTypesUseCase from '@/modules/occurence/domain/usecases/i_get_occurrence_types_use_case';
import IUpdateOccurrenceTypeUseCase from '@/modules/occurence/domain/usecases/i_update_occurrence_type_use_case';
import CreateOccurrenceTypeDto from '@/modules/occurence/dto/create_occurrence_type.dto';
import FilterQueryOccurrenceTypeDto from '@/modules/occurence/dto/filter_query_occurrence_type.dto';
import UpdateOccurrenceTypeDto from '@/modules/occurence/dto/update_occurrence_type.dto';
import {
  CREATE_OCCURRENCE_TYPE_SERVICE,
  DELETE_OCCURRENCE_TYPE_SERVICE,
  GET_OCCURRENCE_TYPE_BY_ID_SERVICE,
  GET_OCCURRENCE_TYPES_SERVICE,
  UPDATE_OCCURRENCE_TYPE_SERVICE,
} from '@/modules/occurence/symbols';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
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

@Controller('api/occurrence-types')
@UseGuards(AuthGuard)
export default class OccurrenceTypeController {
  constructor(
    @Inject(CREATE_OCCURRENCE_TYPE_SERVICE)
    private readonly createOccurrenceTypeUseCase: ICreateOccurrenceTypeUseCase,
    @Inject(UPDATE_OCCURRENCE_TYPE_SERVICE)
    private readonly updateOccurrenceTypeUseCase: IUpdateOccurrenceTypeUseCase,
    @Inject(DELETE_OCCURRENCE_TYPE_SERVICE)
    private readonly deleteOccurrenceTypeUseCase: IDeleteOccurrenceTypeUseCase,
    @Inject(GET_OCCURRENCE_TYPES_SERVICE)
    private readonly getOccurrenceTypesUseCase: IGetOccurrenceTypesUseCase,
    @Inject(GET_OCCURRENCE_TYPE_BY_ID_SERVICE)
    private readonly getOccurrenceTypeByIdUseCase: IGetOccurrenceTypeByIdUseCase,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createOccurrenceType(@Body() dto: CreateOccurrenceTypeDto) {
    const result = await this.createOccurrenceTypeUseCase.execute({
      name: dto.name,
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
  async getOccurrenceTypes(
    @Query() query: PageOptionsDto,
    @Query() filterQueryOccurrenceType: FilterQueryOccurrenceTypeDto,
  ) {
    const result = await this.getOccurrenceTypesUseCase.execute({
      pageOptions: new PageOptionsEntity(query.order, query.page, query.take),
      name: filterQueryOccurrenceType.name,
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
  async getOccurrenceTypeById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.getOccurrenceTypeByIdUseCase.execute({ id });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateOccurrenceType(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOccurrenceTypeDto,
  ) {
    const result = await this.updateOccurrenceTypeUseCase.execute({
      id,
      name: dto.name,
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
  async deleteOccurrenceType(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.deleteOccurrenceTypeUseCase.execute({ id });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
}
