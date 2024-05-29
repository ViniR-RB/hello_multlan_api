import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import ICreateUserUseCase, {
  CreateUserParams,
} from 'src/modules/user/domain/usecase/i_create_user_use_case';
import CreateUserDto from 'src/modules/user/dto/create_user.dto';
import { CREATE_USER_SERVICE } from 'src/modules/user/symbols';
import ILoginUseCase, { LoginParams } from '../domain/usecase/i_login_use_case';
import LoginUserDto from '../dto/login_user.dto';
import { LOGIN_USER_SERVICE } from '../symbols';

@Controller('/api/auth')
export default class AuthController {
  constructor(
    @Inject(CREATE_USER_SERVICE)
    private readonly createUserService: ICreateUserUseCase,
    @Inject(LOGIN_USER_SERVICE)
    private readonly loginUserService: ILoginUseCase,
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
}
