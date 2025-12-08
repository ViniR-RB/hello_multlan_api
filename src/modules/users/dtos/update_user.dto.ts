import CreateUserDto from '@/modules/users/dtos/create_user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class UpdateUserDto extends OmitType(
  PartialType(CreateUserDto),
  ['password'],
) {
  @IsNumber()
  id: number;
}
