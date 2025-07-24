import ConfigurationService from '@/core/services/configuration.service';
import ICreateUserUseCase, {
  CreateUserParams,
} from '@/modules/user/domain/usecase/i_create_user_use_case';
import { USER_ROLE } from '@/modules/user/domain/user.entity';
import CreateUserAdminDto from '@/modules/user/dto/create_user_admin.dto';
import { CREATE_USER_SERVICE } from '@/modules/user/symbols';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configurationService = app.get(ConfigurationService);
  const createUserService = app.get<ICreateUserUseCase>(CREATE_USER_SERVICE);
  await createUserAdmin(configurationService, createUserService);
  await app.listen(configurationService.get('PORT'));
}
bootstrap();

async function createUserAdmin(
  configurationService: ConfigurationService,
  createUserService: ICreateUserUseCase,
) {
  const createUserDto = plainToClass(CreateUserAdminDto, {
    email: configurationService.get('USER_ADMIN_EMAIL'),
    name: configurationService.get('USER_ADMIN_EMAIL'),
    password: configurationService.get('USER_ADMIN_PASSWORD'),
    role: USER_ROLE.ADMIN,
  });

  const param = plainToClass(CreateUserParams, {
    user: createUserDto,
  });

  await createUserService.call(param);
}
