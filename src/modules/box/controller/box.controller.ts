import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import ICreateBoxUseCase, {
  CreateBoxPrams,
} from '../domain/usecases/i_create_box_use_case';
import IGetAllBoxUseCase from '../domain/usecases/i_get_all_box_use_case';
import CreateBoxDto from '../dtos/create_box.dto';
import { CREATE_BOX_SERVICE, GET_ALL_BOXS_SERVICE } from '../symbols';

@Controller('/api/box')
export default class BoxController {
  constructor(
    @Inject(CREATE_BOX_SERVICE)
    private readonly createBoxService: ICreateBoxUseCase,
    @Inject(GET_ALL_BOXS_SERVICE)
    private readonly getBoxService: IGetAllBoxUseCase,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createBox(@Body() createBoxDto: CreateBoxDto) {
    const boxParam = plainToClass(CreateBoxPrams, createBoxDto);
    const result = await this.createBoxService.call(boxParam);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
  }
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    const result = await this.getBoxService.call();
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value;
  }
}
