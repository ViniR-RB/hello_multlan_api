import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user_request.decorator';
import { AuthGuard } from '@/core/guards/auth.guard';
import IChangePasswordUseCase from '@/modules/user/domain/usecase/i_change_password_use_case';
import IGetAllUsersUseCase from '@/modules/user/domain/usecase/I_get_all_users_use_case';
import IGetUserByIdUseCase, {
  GetUserByIdParam,
} from '@/modules/user/domain/usecase/i_get_user_by_id_use_case';
import IToggleUserUseCase, {
  ToggleUserParam,
} from '@/modules/user/domain/usecase/i_toggle_user_use_case';
import IUpdateUserUseCase, {
  UpdateUserParam,
} from '@/modules/user/domain/usecase/i_update_user_use_case';
import { USER_ROLE } from '@/modules/user/domain/user.entity';
import ChangePasswordDto from '@/modules/user/dto/change_password.dto';
import CreateUserInternalDto from '@/modules/user/dto/create_user.Internal.dto';
import CreateUserAdminDto from '@/modules/user/dto/create_user_admin.dto';
import UpdateUserDto from '@/modules/user/dto/update_user.dto';
import UserDto from '@/modules/user/dto/user.dto';
import UserResponseDto from '@/modules/user/dto/user_response.dto';
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import ICreateUserUseCase, {
  CreateUserParams,
} from 'src/modules/user/domain/usecase/i_create_user_use_case';
import IUpdateFirebaseIdUseCase, {
  UpdateFirebaseIdParams,
} from 'src/modules/user/domain/usecase/i_update_firebase_id_use_case';
import UpdateFirebaseIdDto from 'src/modules/user/dto/update_firebase_id.dto';
import {
  CREATE_USER_SERVICE,
  GET_USER_BY_ID_SERVICE,
  TOGGLE_USER_SERVICE,
  UPDATE_FIREBASE_ID_SERVICE,
  UPDATE_USER_SERVICE,
} from 'src/modules/user/symbols';
import ILoginUseCase, { LoginParams } from '../domain/usecase/i_login_use_case';
import IRefreshTokenUseCase from '../domain/usecase/I_refresh_tokens_use_case';
import IShowMyUserUseCase from '../domain/usecase/i_show_my_user_use_case';
import LoginUserDto from '../dto/login_user.dto';
import RefreshTokenDto from '../dto/refresh_token.dto';
import {
  CHANGE_PASSWORD_SERVICE,
  GET_ALL_USERS_SERVICE,
  LOGIN_USER_SERVICE,
  REFRESH_TOKENS_SERVICE,
  SHOW_MY_USER_SERVICE,
} from '../symbols';

@Controller('/api/auth')
export default class AuthController {
  constructor(
    @Inject(CREATE_USER_SERVICE)
    private readonly createUserService: ICreateUserUseCase,
    @Inject(LOGIN_USER_SERVICE)
    private readonly loginUserService: ILoginUseCase,
    @Inject(SHOW_MY_USER_SERVICE)
    private readonly showMyUserService: IShowMyUserUseCase,
    @Inject(REFRESH_TOKENS_SERVICE)
    private readonly refreshTokensService: IRefreshTokenUseCase,
    @Inject(CHANGE_PASSWORD_SERVICE)
    private readonly changePasswordService: IChangePasswordUseCase,
    @Inject(GET_ALL_USERS_SERVICE)
    private readonly getAllUsersService: IGetAllUsersUseCase,
    @Inject(UPDATE_USER_SERVICE)
    private readonly updateUserService: IUpdateUserUseCase,
    @Inject(GET_USER_BY_ID_SERVICE)
    private readonly getUserByIdService: IGetUserByIdUseCase,
    @Inject(TOGGLE_USER_SERVICE)
    private readonly toggleUserService: IToggleUserUseCase,
    @Inject(UPDATE_FIREBASE_ID_SERVICE)
    private readonly updateFirebaseIdService: IUpdateFirebaseIdUseCase,
  ) {}
  @Post('/register-internal')
  @HttpCode(HttpStatus.CREATED)
  async registerInternal(@Body() body: CreateUserInternalDto) {
    const userData = plainToClass(CreateUserParams, {
      user: body,
    });
    const resultCreateUser = await this.createUserService.call(userData);
    if (resultCreateUser.isLeft()) {
      throw new HttpException(
        resultCreateUser.value.message,
        resultCreateUser.value.statusCode,
      );
    }
    return plainToClass(UserResponseDto, resultCreateUser.value);
  }

  @Post('/register-admin')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: CreateUserAdminDto) {
    const userData = plainToClass(CreateUserParams, {
      user: body,
    });
    const resultCreateUser = await this.createUserService.call(userData);
    if (resultCreateUser.isLeft()) {
      throw new HttpException(
        resultCreateUser.value.message,
        resultCreateUser.value.statusCode,
      );
    }
    return plainToClass(UserResponseDto, resultCreateUser.value);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginUserDto) {
    const loginData = plainToClass(LoginParams, body);
    const resultLoginUser = await this.loginUserService.call(loginData);
    if (resultLoginUser.isLeft()) {
      throw new HttpException(
        resultLoginUser.value.message,
        resultLoginUser.value.statusCode,
      );
    }
    return resultLoginUser.value;
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@User() user: UserDto) {
    return user;
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    const result = await this.getAllUsersService.call();

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value;
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refresh(@Req() request: any, @Body() body: RefreshTokenDto) {
    const jwtSignPayload = request['user'];
    const resultRefreshTokens = await this.refreshTokensService.call({
      sub: jwtSignPayload.sub,
      role: jwtSignPayload.role,
      type: jwtSignPayload.type,
    });
    if (resultRefreshTokens.isLeft()) {
      throw new HttpException(
        resultRefreshTokens.value.message,
        resultRefreshTokens.value.statusCode,
      );
    }
    return resultRefreshTokens.value;
  }
  @Post('/change-password/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const result = await this.changePasswordService.call(
      changePasswordDto.password,
      id,
    );

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return {};
  }

  @Post('/update-user/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    const param = plainToClass(UpdateUserParam, {
      userUpdateData: updateUser,
      userId: id,
    });
    const result = await this.updateUserService.execute(param);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
  }

  @Post('/toggle-user/:id')
  @UseGuards(AuthGuard)
  @Roles(USER_ROLE.ADMIN)
  async toggleUser(@Param('id', ParseUUIDPipe) id: string) {
    const param = plainToClass(ToggleUserParam, {
      userId: id,
    });

    const result = await this.toggleUserService.call(param);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value;
  }

  @Get('/get-user/:id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const param = plainToClass(GetUserByIdParam, {
      userId: id,
    });
    const result = await this.getUserByIdService.execute(param);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }
    return result.value;
  }

  @Post('/update-firebase-id/:id')
  @HttpCode(HttpStatus.OK)
  async updateFirebaseId(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFirebaseIdDto: UpdateFirebaseIdDto,
  ) {
    const param = new UpdateFirebaseIdParams(
      id,
      updateFirebaseIdDto.firebaseId,
    );
    const result = await this.updateFirebaseIdService.call(param);

    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode);
    }

    return result.value.toObject();
  }
}
