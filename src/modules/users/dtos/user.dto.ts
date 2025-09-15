import UserRole from '@/modules/users/domain/entities/user_role';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';

export default class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(6)
  password: string;

  @IsString()
  @IsOptional()
  @ValidateIf(obj => obj.fcmToken !== null)
  fcmToken: string | null;

  @IsEnum(UserRole)
  @IsString()
  role: UserRole;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
