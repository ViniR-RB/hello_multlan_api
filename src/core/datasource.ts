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
async function runMigrations() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const pendingMigrations = await AppDataSource.showMigrations();
    if (pendingMigrations) {
      console.log('Running pending migrations...');
      await AppDataSource.runMigrations();
      console.log('✅ Migrations completed successfully');
    } else {
      console.log('ℹ️  No pending migrations');
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(0); // Exit with 0 to continue starting the app
  }
}

runMigrations();
