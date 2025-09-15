import UserDto from '@/modules/users/dtos/user.dto';
import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export default class CreateUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @IsString()
  @Length(6)
  @Expose()
  declare password: string;
}
