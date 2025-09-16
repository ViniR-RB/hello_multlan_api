import OccurrenceStatus from '@/modules/occurence/domain/entities/occurrence_status';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export default class OccurrenceFilterDto {
  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  boxId?: string;

  @IsEnum(OccurrenceStatus)
  @IsOptional()
  status?: OccurrenceStatus;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  userId?: number;
}
