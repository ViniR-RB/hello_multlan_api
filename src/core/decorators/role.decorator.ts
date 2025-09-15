import UserRole from '@/modules/users/domain/entities/user_role';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
