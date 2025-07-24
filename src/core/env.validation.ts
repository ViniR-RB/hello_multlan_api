import { plainToInstance, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';

export default class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  SUPABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_API_KEY: string;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  SALT: number;
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  // Firebase Configuration
  @IsString()
  @IsNotEmpty()
  FIREBASE_PROJECT_ID: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_PRIVATE_KEY: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_CLIENT_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  USER_ADMIN_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  USER_ADMIN_PASSWORD: string;
}

export function validateEnvironmentVariables(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
