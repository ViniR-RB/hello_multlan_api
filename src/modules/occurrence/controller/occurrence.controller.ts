import { Roles } from '@/core/decorators/role.decorator';
import { AuthGuard } from '@/core/guards/auth.guard';
import { RolesGuard } from '@/core/guards/role.guard';
import { JwtSignPayload } from '@/core/interfaces/jwt.payload';
import IAssignOccurrenceUseCase, {
  AssignOccurrenceParams,
} from '@/modules/occurrence/domain/usecases/i_assign_occurrence_use_case';
import ICancelOccurrenceUseCase, {
  CancelOccurrenceParams,
} from '@/modules/occurrence/domain/usecases/i_cancel_occurrence_use_case';
import ICloseOccurrenceUseCase, {
  CloseOccurrenceParams,
} from '@/modules/occurrence/domain/usecases/i_close_occurrence_use_case';
import ICreateOccurrenceUseCase, {
  CreateOccurrenceParams,
} from '@/modules/occurrence/domain/usecases/i_create_occurrence_use_case';
import IGetAllOccurrencesUseCase from '@/modules/occurrence/domain/usecases/i_get_all_occurrences_use_case';
import IGetOccurrenceByIdUseCase from '@/modules/occurrence/domain/usecases/i_get_occurrence_by_id_use_case';
import IGetOccurrencesByBoxUseCase from '@/modules/occurrence/domain/usecases/i_get_occurrences_by_box_use_case';
import IUpdateOccurrenceUseCase, {
  UpdateOccurrenceParams,
} from '@/modules/occurrence/domain/usecases/i_update_occurrence_use_case';
import CancelOccurrenceDto from '@/modules/occurrence/dtos/cancel_occurrence.dto';
import CreateOccurrenceDto from '@/modules/occurrence/dtos/create_occurrence.dto';
import UpdateOccurrenceDto from '@/modules/occurrence/dtos/update_occurrence.dto';
import {
  ASSIGN_OCCURRENCE_SERVICE,
  CANCEL_OCCURRENCE_SERVICE,
  CLOSE_OCCURRENCE_SERVICE,
  CREATE_OCCURRENCE_SERVICE,
  GET_ALL_OCCURRENCES_SERVICE,
  GET_OCCURRENCE_BY_ID_SERVICE,
  GET_OCCURRENCES_BY_BOX_SERVICE,
  UPDATE_OCCURRENCE_SERVICE,
} from '@/modules/occurrence/symbols';
import { USER_ROLE } from '@/modules/user/domain/user.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Controller('/api/occurrences')
@UseGuards(AuthGuard, RolesGuard)
export default class OccurrenceController {
  constructor(
    @Inject(CREATE_OCCURRENCE_SERVICE)
    private readonly createOccurrenceService: ICreateOccurrenceUseCase,
    @Inject(GET_ALL_OCCURRENCES_SERVICE)
    private readonly getAllOccurrencesService: IGetAllOccurrencesUseCase,
    @Inject(GET_OCCURRENCE_BY_ID_SERVICE)
    private readonly getOccurrenceByIdService: IGetOccurrenceByIdUseCase,
    @Inject(UPDATE_OCCURRENCE_SERVICE)
    private readonly updateOccurrenceService: IUpdateOccurrenceUseCase,
    @Inject(ASSIGN_OCCURRENCE_SERVICE)
    private readonly assignOccurrenceService: IAssignOccurrenceUseCase,
    @Inject(CLOSE_OCCURRENCE_SERVICE)
    private readonly closeOccurrenceService: ICloseOccurrenceUseCase,
    @Inject(CANCEL_OCCURRENCE_SERVICE)
    private readonly cancelOccurrenceService: ICancelOccurrenceUseCase,
    @Inject(GET_OCCURRENCES_BY_BOX_SERVICE)
    private readonly getOccurrencesByBoxService: IGetOccurrencesByBoxUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(USER_ROLE.ADMIN)
  async create(
    @Body() createOccurrenceDto: CreateOccurrenceDto,
    @Req() req: any,
  ) {
    const params = plainToClass(CreateOccurrenceParams, {
      ...createOccurrenceDto,
      createdByUserId: req.user.sub,
      assignedToUserId: createOccurrenceDto.assignedToUserId,
    });

    const result = await this.createOccurrenceService.call(params);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toObject();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.getAllOccurrencesService.call();
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.map(occurrence => occurrence.toObject());
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.getOccurrenceByIdService.call(id);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toObject();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOccurrenceDto: UpdateOccurrenceDto,
  ) {
    const params = plainToClass(UpdateOccurrenceParams, {
      id,
      ...updateOccurrenceDto,
    });

    const result = await this.updateOccurrenceService.call(params);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toObject();
  }

  @Put(':id/assign')
  @HttpCode(HttpStatus.OK)
  async assign(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const user = req.user;
    const params = new AssignOccurrenceParams(id, user.sub);
    const result = await this.assignOccurrenceService.call(params);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toObject();
  }

  @Put(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(
    @Param('id', ParseUUIDPipe) occurenceId: string,
    @Req() req: any,
  ) {
    const user: JwtSignPayload = req.user;
    const param = new CloseOccurrenceParams(occurenceId, user.sub);
    const result = await this.closeOccurrenceService.call(param);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toObject();
  }

  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('id', ParseUUIDPipe) occurrenceId: string,
    @Body() cancelOccurrenceDto: CancelOccurrenceDto,
    @Req() req: any,
  ) {
    const user: JwtSignPayload = req.user;
    const params = new CancelOccurrenceParams(
      occurrenceId,
      user.sub,
      cancelOccurrenceDto.cancellationReason,
    );
    const result = await this.cancelOccurrenceService.call(params);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toObject();
  }

  @Get('box/:boxId')
  @HttpCode(HttpStatus.OK)
  async findByBox(@Param('boxId', ParseUUIDPipe) boxId: string) {
    const result = await this.getOccurrencesByBoxService.call(boxId);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.map(occurrence => occurrence.toObject());
  }
}
