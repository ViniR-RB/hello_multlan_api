import { USER_ROLE } from '@/modules/user/domain/user.entity';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
