import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CoreModule } from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import AuthModule from '@/modules/auth/auth.module';
import BoxModule from '@/modules/box/box.module';
import UserModule from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CoreModule,
    BoxModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        type: 'postgres',
        host: configurationService.get('DATABASE_HOST'),
        port: configurationService.get('DATABASE_PORT'),
        username: configurationService.get('DATABASE_USERNAME'),
        password: configurationService.get('DATABASE_PASSWORD'),
        database: configurationService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.model{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
