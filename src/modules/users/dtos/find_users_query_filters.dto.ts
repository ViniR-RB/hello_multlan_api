import UserRole from '@/modules/users/domain/entities/user_role';
import { IsEnum, IsOptional } from 'class-validator';

export default class FindUsersQueryFiltersDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
