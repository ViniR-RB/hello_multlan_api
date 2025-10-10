import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user_request.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import ICreateBoxUseCase from '@/modules/box/domain/usecase/i_create_box_use_case';
import IDeleteBoxUseCase from '@/modules/box/domain/usecase/i_delete_box_use_case';
import IFindAllBoxesUseCase from '@/modules/box/domain/usecase/i_find_all_boxes_use_case';
import IGetBoxByIdUseCase from '@/modules/box/domain/usecase/i_get_box_by_id_use_case';
import IGetBoxSummaryUseCase from '@/modules/box/domain/usecase/i_get_box_summary_use_case';
import IGetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersUseCase from '@/modules/box/domain/usecase/i_get_boxes_with_label_and_location_by_lat_long_min_max_and_filters_use_case';
import IUpdateBoxUseCase from '@/modules/box/domain/usecase/i_update_box_use_case';
import CreateBoxDto from '@/modules/box/dtos/create_box.dto';
import GetBoxesByLatLongMinMaxAndFiltersDto from '@/modules/box/dtos/get_boxes_by_lat_long_min_max_and_filters.dto';
import UpdateBoxDto from '@/modules/box/dtos/update_box.dto';
import {
  CREATE_BOX_SERVICE,
  DELETE_BOX_SERVICE,
  FIND_ALL_BOXES_SERVICE,
  GET_BOX_BY_ID_SERVICE,
  GET_BOX_SUMMARY_SERVICE,
  GET_BOXES_WITH_LABEL_AND_LOCATION_BY_LAT_LONG_MIN_MAX_AND_FILTERS,
  UPDATE_BOX_SERVICE,
} from '@/modules/box/symbols';
import UserRole from '@/modules/users/domain/entities/user_role';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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

    @Inject(GET_BOX_BY_ID_SERVICE)
    private readonly getBoxByIdService: IGetBoxByIdUseCase,
    @Inject(FIND_ALL_BOXES_SERVICE)
    private readonly findAllBoxesService: IFindAllBoxesUseCase,
    @Inject(GET_BOX_SUMMARY_SERVICE)
    private readonly getBoxSummaryService: IGetBoxSummaryUseCase,
    @Inject(GET_BOXES_WITH_LABEL_AND_LOCATION_BY_LAT_LONG_MIN_MAX_AND_FILTERS)
    private readonly getBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersService: IGetBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersUseCase,
    @Inject(DELETE_BOX_SERVICE)
    private readonly deleteBoxService: IDeleteBoxUseCase,
  ) {}

  @Get('/summary')
  async getSummary() {
    const result = await this.getBoxSummaryService.execute();
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Get('/all')
  async findAllBoxes() {
    const result = await this.findAllBoxesService.execute();
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

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
  async getBoxesWithLabelAndLocationByLatLongMinMaxAndFilters(
    @Query() query: GetBoxesByLatLongMinMaxAndFiltersDto,
  ) {
    const result =
      await this.getBoxesWithLabelAndLocationByLatLongMinMaxAndFiltersService.execute(
        {
          latMax: query.latMax,
          latMin: query.latMin,
          lngMax: query.lngMax,
          lngMin: query.lngMin,
          zone: query.zone,
        },
      );
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteBox(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserDto,
  ) {
    const result = await this.deleteBoxService.execute({
      boxId: id,
      userActionId: user.id,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return;
  }
}
