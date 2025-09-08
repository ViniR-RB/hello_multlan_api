import ICreateBoxUseCase from '@/modules/box/domain/usecase/i_create_box_use_case';
import IUpdateBoxUseCase from '@/modules/box/domain/usecase/i_update_box_use_case';
import CreateBoxDto from '@/modules/box/dtos/create_box.dto';
import UpdateBoxDto from '@/modules/box/dtos/update_box.dto';
import { CREATE_BOX_SERVICE, UPDATE_BOX_SERVICE } from '@/modules/box/symbols';
import {
  Body,
  Controller,
  HttpException,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/box')
export default class BoxController {
  constructor(
    @Inject(CREATE_BOX_SERVICE)
    private readonly createBoxService: ICreateBoxUseCase,
    @Inject(UPDATE_BOX_SERVICE)
    private readonly updateBoxService: IUpdateBoxUseCase,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createBox(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBoxDto: CreateBoxDto,
  ) {
    const savedBox = await this.createBoxService.execute({
      label: createBoxDto.label,
      latitude: createBoxDto.latitude,
      longitude: createBoxDto.longitude,
      freeSpace: createBoxDto.freeSpace,
      filledSpace: createBoxDto.filledSpace,
      signal: createBoxDto.signal,
      zone: createBoxDto.zone,
      listUser: createBoxDto.listUser,
      routeId: createBoxDto.routeId,
      note: createBoxDto.note,
      boxFile: {
        buffer: file.buffer,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        encoding: file.encoding,
      },
    });
    if (savedBox.isLeft()) {
      throw new HttpException(
        savedBox.value.message,
        savedBox.value.statusCode,
        {
          cause: savedBox.value.cause,
        },
      );
    }
    return savedBox.value.fromResponse();
  }

  @Put('/:id')
  async updateBox(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoxDto: UpdateBoxDto,
  ) {
    const boxUpdatedResult = await this.updateBoxService.execute({
      id: id,
      ...updateBoxDto,
    });

    if (boxUpdatedResult.isLeft()) {
      throw new HttpException(
        boxUpdatedResult.value.message,
        boxUpdatedResult.value.statusCode,
        {
          cause: boxUpdatedResult.value.cause,
        },
      );
    }
    return boxUpdatedResult.value.fromResponse();
  }
}
