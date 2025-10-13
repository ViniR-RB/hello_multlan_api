import UserRole from '@/modules/users/domain/entities/user_role';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export default class FindUsersQueryFiltersDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  email?: string;
}
