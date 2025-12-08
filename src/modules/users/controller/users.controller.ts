import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user_request.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
import UserRole from '@/modules/users/domain/entities/user_role';
import IDeleteUserUseCase from '@/modules/users/domain/usecase/i_delete_user_use_case';
import IFindUserByIdUseCase from '@/modules/users/domain/usecase/i_find_user_by_id_use_case';
import IFindUsersByFiltersUseCase from '@/modules/users/domain/usecase/i_find_users_by_filters_use_case';
import IToggleUserUseCase from '@/modules/users/domain/usecase/i_toggle_user_use_case';
import IUpdateMyPasswordUseCase from '@/modules/users/domain/usecase/i_update_my_password_use_case';
import TargetUserReciveActionDto from '@/modules/users/dto/target_user_recive_action.dto';
import FindUsersQueryFiltersDto from '@/modules/users/dtos/find_users_query_filters.dto';
import UpdateMyPasswordDto from '@/modules/users/dtos/update_my_password.dto';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  DELETE_USER_SERVICE,
  FIND_USER_BY_ID_SERVICE,
  FIND_USERS_BY_FILTERS_SERVICE,
  TOGGLE_USER_SERVICE,
  UPDATE_MY_PASSWORD_SERVICE,
} from '@/modules/users/symbols';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('/api/users')
export default class UsersController {
  constructor(
    @Inject(FIND_USERS_BY_FILTERS_SERVICE)
    private readonly findUsersByFiltersService: IFindUsersByFiltersUseCase,
    @Inject(FIND_USER_BY_ID_SERVICE)
    private readonly findUserByIdService: IFindUserByIdUseCase,
    @Inject(UPDATE_MY_PASSWORD_SERVICE)
    private readonly updateMyPasswordService: IUpdateMyPasswordUseCase,
    @Inject(TOGGLE_USER_SERVICE)
    private readonly toggleUserService: IToggleUserUseCase,
    @Inject(DELETE_USER_SERVICE)
    private readonly deleteUserService: IDeleteUserUseCase,
  ) {}

  @Get('/filters')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findByFilters(
    @Query() options: PageOptionsDto,
    @Query() findUsersQueryFilters: FindUsersQueryFiltersDto,
  ) {
    const result = await this.findUsersByFiltersService.execute({
      options: new PageOptionsEntity(options.order, options.page, options.take),
      email: findUsersQueryFilters.email,
      role: findUsersQueryFilters.role,
    });
    if (result.isLeft()) {
      const error = result.value;
      throw error;
    }
    return result.value.fromResponse();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.findUserByIdService.execute({
      userId: id,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }
    return result.value.fromResponse();
  }

  @Post('/reset-password')
  @UseGuards(AuthGuard)
  async updateMyPassword(
    @User() user: UserDto,
    @Body() body: UpdateMyPasswordDto,
  ) {
    const result = await this.updateMyPasswordService.execute({
      userId: user.id,
      oldPassword: body.oldPassword,
      newPassword: body.newPassword,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }
    return result.value;
  }

  @Patch('/toggle')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async toggleUser(
    @User() user: UserDto,
    @Body() body: TargetUserReciveActionDto,
  ) {
    const result = await this.toggleUserService.execute({
      targetUserId: body.targetUserId,
      requestingUserId: user.id,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }
    return result.value.fromResponse();
  }

  @Delete('/delete')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(
    @User() user: UserDto,
    @Body() body: TargetUserReciveActionDto,
  ) {
    const result = await this.deleteUserService.execute({
      targetUserId: body.targetUserId,
      requestingUserId: user.id,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value,
      });
    }
    return;
  }
}
