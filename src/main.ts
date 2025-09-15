import ConfigurationService from '@/core/services/configuration.service';
import UserRole from '@/modules/users/domain/entities/user_role';
import ICreateUserUseCase from '@/modules/users/domain/usecase/i_create_user_use_case';
import { CREATE_USER_SERVICE } from '@/modules/users/symbols';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      whitelist: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('Base APi')
    .setDescription('Base Api')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'DEV')
    .addTag('Base Api')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const createUserService = app.get<ICreateUserUseCase>(CREATE_USER_SERVICE);
  const configurationService =
    app.get<ConfigurationService>(ConfigurationService);
  await createUserService.execute({
    fcmToken: null,
    name: 'ADMIN',
    email: configurationService.get('ADMIN_EMAIL'),
    password: configurationService.get('ADMIN_PASSWORD'),
    role: UserRole.ADMIN,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
