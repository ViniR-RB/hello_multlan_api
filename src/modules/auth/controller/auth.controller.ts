import { AuthGuard } from '@/core/guards/auth.guard';
import { JwtVerifyPayload } from '@/core/interfaces/jwt.payload';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import ICreateUserUseCase, {
  CreateUserParams,
} from 'src/modules/user/domain/usecase/i_create_user_use_case';
import CreateUserDto from 'src/modules/user/dto/create_user.dto';
import { CREATE_USER_SERVICE } from 'src/modules/user/symbols';
import ILoginUseCase, { LoginParams } from '../domain/usecase/i_login_use_case';
import IRefreshTokenUseCase from '../domain/usecase/I_refresh_tokens_use_case';
import IShowMyUserUseCase, {
  ShowMyUserParam,
} from '../domain/usecase/i_show_my_user_use_case';
import LoginUserDto from '../dto/login_user.dto';
import {
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

  @Post('/refresh')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: any) {
    const jwtSignPayload = request['user'];
    const resultRefreshTokens = await this.refreshTokensService.call({
      sub: jwtSignPayload.sub,
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
}
