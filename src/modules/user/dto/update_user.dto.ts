import CreateUserDto from '@/modules/user/dto/create_user.dto';
import { PartialType } from '@nestjs/mapped-types';

export default class UpdateUserDto extends PartialType(CreateUserDto) {}
