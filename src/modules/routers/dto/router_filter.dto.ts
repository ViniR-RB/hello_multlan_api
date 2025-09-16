import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export default class RouterFilterDto {
  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  boxId?: string;

  @Type(() => String)
  @IsString()
  @IsUUID()
  @IsOptional()
  routerId?: string;
}
