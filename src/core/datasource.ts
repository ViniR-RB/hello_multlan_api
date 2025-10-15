import EnvironmentVariables from '@/core/config/enviroment';
import ConfigurationService from '@/core/services/configuration.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const configService = new ConfigService<EnvironmentVariables, true>();
const configurationService = new ConfigurationService(configService);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configurationService.get('DATABASE_HOST'),
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: configurationService.get('DATABASE_USERNAME'),
  password: configurationService.get('DATABASE_PASSWORD'),
  database: configurationService.get('DATABASE_NAME'),
  migrations: [__dirname + '/../../migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
});
