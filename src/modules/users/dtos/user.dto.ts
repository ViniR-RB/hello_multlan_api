import {
  IsDate,
  IsEmail,
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

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
