import { USER_ROLE } from '@/modules/user/domain/user.entity';
import CreateUserDto from '@/modules/user/dto/create_user.dto';
import { Equals } from 'class-validator';

export default class CreateUserInternalDto extends CreateUserDto {
  @Equals(USER_ROLE.INTERNAL, {
    message: 'role must be internal',
  })
  declare role: USER_ROLE;
}
