import { AuthGuard } from '@/core/guards/auth.guard';
import { JwtVerifyPayload } from '@/core/interfaces/jwt.payload';
import IChangePasswordUseCase from '@/modules/user/domain/usecase/i_change_password_use_case';
import IGetAllUsersUseCase from '@/modules/user/domain/usecase/I_get_all_users_use_case';
import IUpdateUserUseCase, {
  UpdateUserParam,
} from '@/modules/user/domain/usecase/i_update_user_use_case';
import ChangePasswordDto from '@/modules/user/dto/change_password.dto';
import UpdateUserDto from '@/modules/user/dto/update_user.dto';
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
import CreateUserDto from 'src/modules/user/dto/create_user.dto';
import {
  CREATE_USER_SERVICE,
  UPDATE_USER_SERVICE,
} from 'src/modules/user/symbols';
import ILoginUseCase, { LoginParams } from '../domain/usecase/i_login_use_case';
import IRefreshTokenUseCase from '../domain/usecase/I_refresh_tokens_use_case';
import IShowMyUserUseCase, {
  ShowMyUserParam,
} from '../domain/usecase/i_show_my_user_use_case';
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
  ) {}
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: CreateUserDto) {
    const userData = plainToClass(CreateUserParams, body);
    const resultCreateUser = await this.createUserService.call(userData);
    if (resultCreateUser.isLeft()) {
      throw new HttpException(
        resultCreateUser.value.message,
        resultCreateUser.value.statusCode,
      );
    }
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
  async me(@Req() resquest: any) {
    const user: JwtVerifyPayload = resquest['user'];
    const showMyUserParam: ShowMyUserParam = plainToClass(
      ShowMyUserParam,
      user.sub,
    );
    const resultUserFinder = await this.showMyUserService.call(showMyUserParam);
    if (resultUserFinder.isLeft()) {
      throw new HttpException(
        resultUserFinder.value.message,
        resultUserFinder.value.statusCode,
      );
    }
    return resultUserFinder.value;
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
}
