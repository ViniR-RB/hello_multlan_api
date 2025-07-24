import UserDto from '@/modules/user/dto/user.dto';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export default class UserResponseDto extends UserDto {
  @Exclude()
  @IsString()
  declare password: string;
}
