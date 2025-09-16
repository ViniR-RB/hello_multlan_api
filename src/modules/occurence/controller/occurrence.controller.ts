import { User } from '@/core/decorators/user_request.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import IApproveOccurrenceUseCase from '@/modules/occurence/domain/usecases/i_approve_occurrence_use_case';
import ICancelOccurrenceUseCase from '@/modules/occurence/domain/usecases/i_cancel_occurrence_use_case';
import ICreateOcurrenceUseCase from '@/modules/occurence/domain/usecases/i_create_ocurrence_use_case';
import CancelOccurrenceDto from '@/modules/occurence/dto/cancel_occurrence.dto';
import CreateOccurrenceDto from '@/modules/occurence/dto/create_occurrence.dto';
import {
  APPROVE_OCCURRENCE_SERVICE,
  CANCEL_OCCURRENCE_SERVICE,
  CREATE_OCCURRENCE_SERVICE,
} from '@/modules/occurence/symbols';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  Body,
  Controller,
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

@Controller('api/occurrences')
export default class OccurrenceController {
  constructor(
    @Inject(CREATE_OCCURRENCE_SERVICE)
    private readonly createOcurrenceUseCase: ICreateOcurrenceUseCase,
    @Inject(CANCEL_OCCURRENCE_SERVICE)
    private readonly cancelOccurrenceUseCase: ICancelOccurrenceUseCase,
    @Inject(APPROVE_OCCURRENCE_SERVICE)
    private readonly approveOccurrenceUseCase: IApproveOccurrenceUseCase,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createOccurrence(@Body() dto: CreateOccurrenceDto) {
    const result = await this.createOcurrenceUseCase.execute({
      title: dto.title,
      boxId: dto.boxId,
      description: dto.description,
      usersId: dto.usersId,
    });

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
  @Put(':occurrenceId/cancel')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelOccurrence(
    @Param('occurrenceId', ParseUUIDPipe) occurrenceId: string,
    @Body() dto: CancelOccurrenceDto,
    @User() user: UserDto,
  ) {
    const result = await this.cancelOccurrenceUseCase.execute({
      occurrenceId: occurrenceId,
      userCancelingId: user.id,
      reason: dto.cancelReason,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
  @Put(':occurrenceId/resolved')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async approveOccurrence(
    @Param('occurrenceId', ParseUUIDPipe) occurrenceId: string,
    @User() user: UserDto,
  ) {
    const result = await this.approveOccurrenceUseCase.execute({
      occurrenceId: occurrenceId,
      userApprovingId: user.id,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
}
