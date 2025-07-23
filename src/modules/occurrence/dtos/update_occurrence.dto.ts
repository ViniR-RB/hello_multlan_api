import { IsOptional, IsString } from 'class-validator';

export default class UpdateOccurrenceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
