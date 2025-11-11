import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

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

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasRouteId?: boolean;

  @IsOptional()
  @IsUUID()
  routeId?: string;
}
