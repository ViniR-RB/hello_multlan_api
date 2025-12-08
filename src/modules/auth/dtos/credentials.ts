import UserDto from '@/modules/users/dtos/user.dto';
import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export default class Credentials extends OmitType(UserDto, [
  'id',
  'name',
  'role',
  'fcmToken',
  'role',
  'createdAt',
  'updatedAt',
]) {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
