import { Roles } from '@/core/decorators/role.decorator';
import { User } from '@/core/decorators/user_request.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import ILoginUseCase, {
  LoginParam,
} from '@/modules/auth/domain/usecase/i_login_use_case';
import IRefreshTokenUseCase, {
  RefreshTokenParam,
} from '@/modules/auth/domain/usecase/i_refresh_token_use_case';
import Credentials from '@/modules/auth/dtos/credentials';
import { LOGIN_SERVICE, REFRESH_TOKEN_SERVICE } from '@/modules/auth/symbols';
import UserRole from '@/modules/users/domain/entities/user_role';
import ICreateUserUseCase from '@/modules/users/domain/usecase/i_create_user_use_case';
import IUpdateUserUseCase from '@/modules/users/domain/usecase/i_update_user_use_case';
import CreateUserAdminDto from '@/modules/users/dtos/create_user_admin.dto';
import CreateUserInternalDto from '@/modules/users/dtos/create_user_internal.dto';
import UpdateUserDto from '@/modules/users/dtos/update_user.dto';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  CREATE_USER_SERVICE,
  UPDATE_USER_SERVICE,
} from '@/modules/users/symbols';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('Auth')
@Controller('api/auth')
export default class AuthController {
  constructor(
    @Inject(CREATE_USER_SERVICE)
    private readonly createUserService: ICreateUserUseCase,
    @Inject(LOGIN_SERVICE)
    private readonly loginService: ILoginUseCase,
    @Inject(REFRESH_TOKEN_SERVICE)
    private readonly refreshTokenService: IRefreshTokenUseCase,
    @Inject(UPDATE_USER_SERVICE)
    private readonly updateUserService: IUpdateUserUseCase,
  ) {}

  @Post('/register/admin')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserAdminDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Erro in Domain' })
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async createRegisterAdmin(@Body() createUserDto: CreateUserAdminDto) {
    const result = await this.createUserService.execute({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      fcmToken: createUserDto.fcmToken,
      role: createUserDto.role,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return plainToClass(UserDto, result.value.fromResponse());
  }
  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserInternalDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Erro in Domain' })
  async createRegister(@Body() createUserDto: CreateUserInternalDto) {
    const result = await this.createUserService.execute({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      fcmToken: createUserDto.fcmToken,
      role: createUserDto.role,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return plainToClass(UserDto, result.value.fromResponse());
  }
  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: Credentials })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() credentials: Credentials) {
    const param = new LoginParam(credentials.email, credentials.password);
    const result = await this.loginService.execute(param);
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }

  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'Current user info', type: UserDto })
  @UseGuards(AuthGuard)
  async getMe(@User() user: UserDto) {
    return user;
  }

  @Post('/refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async refreshToken(@User() user: UserDto) {
    const param = new RefreshTokenParam(user.id);

    const resultRefreshTokenService =
      await this.refreshTokenService.execute(param);

    if (resultRefreshTokenService.isLeft()) {
      throw new HttpException(
        resultRefreshTokenService.value.message,
        resultRefreshTokenService.value.statusCode,
      );
    }
    return resultRefreshTokenService.value.fromResponse();
  }

  @Post('update-user')
  @UseGuards(AuthGuard)
  async updateUser(@Body() dto: UpdateUserDto, @User() user: UserDto) {
    const result = await this.updateUserService.execute({
      userId: user.id,
      name: dto.name,
      email: dto.email,
      fcmToken: dto.fcmToken,
    });
    if (result.isLeft()) {
      throw new HttpException(result.value.message, result.value.statusCode, {
        cause: result.value.cause,
      });
    }
    return result.value.fromResponse();
  }
}
