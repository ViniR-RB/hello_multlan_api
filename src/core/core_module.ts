import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { validateEnvironmentVariables } from './env.validation';
import ConfigurationService from './services/configuration.service';
import { EncryptionService } from './services/encryption.service';
import JsonWebTokenService from './services/json_web_token.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validate: validateEnvironmentVariables,
    }),
    JwtModule.registerAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],

      useFactory: (configService: ConfigurationService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [ConfigurationService, EncryptionService, JsonWebTokenService],
  exports: [ConfigurationService, EncryptionService, JsonWebTokenService],
})
export class CoreModule {}
