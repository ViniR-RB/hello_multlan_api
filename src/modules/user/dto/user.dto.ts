import { USER_ROLE } from '@/modules/user/domain/user.entity';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export default class UserDto {
  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  password: string;

  @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  firebaseId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
