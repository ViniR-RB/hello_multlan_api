import ConfigurationService from '@/core/services/configuration.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configurationService = app.get(ConfigurationService);
  await app.listen(configurationService.get('PORT'));
}
bootstrap();
