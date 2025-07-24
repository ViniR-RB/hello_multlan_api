import UserDto from '@/modules/user/dto/user.dto';
import { OmitType } from '@nestjs/mapped-types';

export default class CreateUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'updatedAt',
  'firebaseId',
  'isActive',
]) {}
