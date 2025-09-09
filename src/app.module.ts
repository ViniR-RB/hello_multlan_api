import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import AuthModule from '@/modules/auth/auth.module';
import BoxModule from '@/modules/box/box.module';
import RouterModule from '@/modules/routers/route.module';
import UsersModule from '@/modules/users/users.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
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
        logging: ['error'],
        synchronize: true,
      }),
    }),
    CoreModule,
    RouterModule,
    UsersModule,
    AuthModule,
    BoxModule,
    ServeStaticModule.forRootAsync({
      imports: [CoreModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => {
        const nodeEnv = configService.get('NODE_ENV');

        if (nodeEnv === 'dev') {
          const filesPath = path.resolve(process.cwd(), 'files');

          // Criar o diretório se ele não existir
          if (!fs.existsSync(filesPath)) {
            fs.mkdirSync(filesPath, { recursive: true });
            console.log(`📁 Diretório criado: ${filesPath}`);
          } else {
            console.log(`📁 Diretório já existe: ${filesPath}`);
          }

          return [
            {
              rootPath: filesPath,
              serveRoot: '/files/',
            },
          ];
        }

        return [];
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
