import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironmentVariables } from './env.validation';
import ConfigurationService from './services/configuration.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validate: validateEnvironmentVariables,
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class CoreModule {}
