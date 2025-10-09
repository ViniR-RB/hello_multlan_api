import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export default class GetBoxesByLatLongMinMaxAndFiltersDto {
  @Type(() => Number)
  @IsNumber()
  latMin: number;

  @Type(() => Number)
  @IsNumber()
  latMax: number;

  @Type(() => Number)
  @IsNumber()
  lngMin: number;

  @Type(() => Number)
  @IsNumber()
  lngMax: number;

  @IsOptional()
  @IsEnum(BoxZone)
  zone?: BoxZone;
}
