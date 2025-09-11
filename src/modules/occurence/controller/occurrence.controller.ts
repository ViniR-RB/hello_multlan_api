import ICreateOcurrenceUseCase from '@/modules/occurence/domain/usecases/i_create_ocurrence_use_case';
import CreateOccurrenceDto from '@/modules/occurence/dto/create_occurrence.dto';
import { CREATE_OCCURRENCE_SERVICE } from '@/modules/occurence/symbols';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';

@Controller('api/occurrences')
export default class OccurrenceController {
  constructor(
    @Inject(CREATE_OCCURRENCE_SERVICE)
    private readonly createOcurrenceUseCase: ICreateOcurrenceUseCase,
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
}
