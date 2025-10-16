import { IsOptional, IsString } from 'class-validator';

export default class FilterQueryOccurrenceTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}
