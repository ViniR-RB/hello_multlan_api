import { USER_ROLE } from '@/modules/user/domain/user.entity';
import CreateUserDto from '@/modules/user/dto/create_user.dto';
import { Equals } from 'class-validator';

export default class CreateUserAdminDto extends CreateUserDto {
  @Equals(USER_ROLE.ADMIN, {
    message: 'role must be admin',
  })
  declare role: USER_ROLE;
}
