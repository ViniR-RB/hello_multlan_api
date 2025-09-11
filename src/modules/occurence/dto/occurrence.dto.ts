import UserDto from '@/modules/users/dtos/user.dto';
import { IsArray, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export default class OccurrenceDto {
  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsArray()
  users: UserDto[];

  @IsString()
  @IsUUID()
  @IsOptional()
  boxId: string | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
