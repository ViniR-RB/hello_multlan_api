import UserRole from '@/modules/users/domain/entities/user_role';
import CreateUserDto from '@/modules/users/dtos/create_user.dto';
import { Equals } from 'class-validator';

export default class CreateUserInternalDto extends CreateUserDto {
  @Equals(UserRole.INTERNAL)
  declare role: UserRole;
}
