import OccurrenceStatus from '@/modules/occurence/domain/entities/occurrence_status';
import UserDto from '@/modules/users/dtos/user.dto';
import {
  IsArray,
  IsDate,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @IsString()
  @IsUUID()
  @IsEmpty()
  occurrenceTypeId: string | null;

  @IsEnum(OccurrenceStatus)
  status: OccurrenceStatus;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
