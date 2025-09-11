import CreateUserDto from '@/modules/users/dtos/create_user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export default class UpdateUserDto extends OmitType(
  PartialType(CreateUserDto),
  ['password'],
) {}
