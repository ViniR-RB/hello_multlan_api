import AuthGuard from '@/core/guard/auth.guard';
import ICreateBoxUseCase from '@/modules/box/domain/usecase/i_create_box_use_case';
import IGetBoxByIdUseCase from '@/modules/box/domain/usecase/i_get_box_by_id_use_case';
import IGetBoxesWithLabelAndLocationUseCase from '@/modules/box/domain/usecase/i_get_boxes_with_label_and_location_use_case';
import IUpdateBoxUseCase from '@/modules/box/domain/usecase/i_update_box_use_case';
import CreateBoxDto from '@/modules/box/dtos/create_box.dto';
import UpdateBoxDto from '@/modules/box/dtos/update_box.dto';
import {
  CREATE_BOX_SERVICE,
  GET_BOX_BY_ID_SERVICE,
  GET_BOXES_WITH_LOCATION_AND_LABEL_SERVICE,
  UPDATE_BOX_SERVICE,
} from '@/modules/box/symbols';
import {
  Body,
  Controller,
  Get,
  HttpException,
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

@Controller('api/box')
@UseGuards(AuthGuard)
export default class BoxController {
  constructor(
    @Inject(CREATE_BOX_SERVICE)
    private readonly createBoxService: ICreateBoxUseCase,
    @Inject(UPDATE_BOX_SERVICE)
    private readonly updateBoxService: IUpdateBoxUseCase,
    @Inject(GET_BOXES_WITH_LOCATION_AND_LABEL_SERVICE)
    private readonly getBoxesWithLabelAndLocationService: IGetBoxesWithLabelAndLocationUseCase,
    @Inject(GET_BOX_BY_ID_SERVICE)
    private readonly getBoxByIdService: IGetBoxByIdUseCase,
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
  @Get('/:id')
  async getBoxById(@Param('id', ParseUUIDPipe) id: string) {
    const boxResult = await this.getBoxByIdService.execute({ boxId: id });
    if (boxResult.isLeft()) {
      throw new HttpException(
        boxResult.value.message,
        boxResult.value.statusCode,
        {
          cause: boxResult.value.cause,
        },
      );
    }
    return boxResult.value.fromResponse();
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

  @Get('')
  async getBoxesWithLabelAndLocation() {
    const result = await this.getBoxesWithLabelAndLocationService.execute();
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
}
