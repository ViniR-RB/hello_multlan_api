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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from 'src/core/guards/auth.guard';
import FileEntity from 'src/modules/upload/domain/file.entity';
import IUploadFile from 'src/modules/upload/domain/usecase/i_upload_file';
import { UPLOAD_FILE } from 'src/modules/upload/symbols';
import ICreateBoxUseCase, {
  CreateBoxPrams,
} from '../domain/usecases/i_create_box_use_case';
import IGetAllBoxUseCase from '../domain/usecases/i_get_all_box_use_case';
import IUpdateBoxUseCase, {
  UpdateBoxParams,
} from '../domain/usecases/i_update_box_use_case';
import CreateBoxDto from '../dtos/create_box.dto';
import UpdatedBoxDto from '../dtos/updated_box.dto';
import {
  CREATE_BOX_SERVICE,
  GET_ALL_BOXS_SERVICE,
  GET_SUMMARY_BOX,
  UPDATE_BOX_SERVICE,
} from '../symbols';
import IGetSummaryBoxUseCase from '../domain/usecases/i_get_summary_box_use_case';

@Controller('/api/box')
@UseGuards(AuthGuard)
export default class BoxController {
  constructor(
    @Inject(CREATE_BOX_SERVICE)
    private readonly createBoxService: ICreateBoxUseCase,
    @Inject(GET_ALL_BOXS_SERVICE)
    private readonly getBoxService: IGetAllBoxUseCase,
    @Inject(UPDATE_BOX_SERVICE)
    private readonly updateBoxService: IUpdateBoxUseCase,
    @Inject(UPLOAD_FILE)
    private readonly uploadFile: IUploadFile,
    @Inject(GET_SUMMARY_BOX)
    private readonly getSummaryService: IGetSummaryBoxUseCase,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async createBox(
    @Body() createBoxDto: CreateBoxDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadFileEntity = new FileEntity(
      file.originalname,
      file.buffer,
      'box',
    );
    const boxImageUrl = await this.uploadFile.call(uploadFileEntity);
    const data = {
      ...createBoxDto,
      image: boxImageUrl.url,
    };
    const boxParam = plainToClass(CreateBoxPrams, data);
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateBox(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedBoxData: UpdatedBoxDto,
  ) {
    const data = {
      ...updatedBoxData,
      id: id,
    };
    const boxParam = plainToClass(UpdateBoxParams, data);
    const result = await this.updateBoxService.call(boxParam);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value.toJson();
  }

  @Get('/summary')
  @HttpCode(HttpStatus.OK)
  async summary() {
    const result = await this.getSummaryService.call();
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value;
  }
}
