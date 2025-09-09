import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import BoxDto from '@/modules/box/dtos/box.dto';
import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateBoxDto extends PickType(BoxDto, [
  'label',
  'latitude',
  'longitude',
  'freeSpace',
  'filledSpace',
  'signal',
  'zone',
  'listUser',
  'imageUrl',
  'note',
]) {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  latitude: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  longitude: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  freeSpace: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  filledSpace: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  signal: number;

  @Transform(({ value }) => BoxZone[value as keyof typeof BoxZone])
  zone: BoxZone;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (
      value === '' ||
      value === 'null' ||
      value === null ||
      value === undefined
    ) {
      return null;
    }
    return String(value);
  })
  routeId?: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (
      value === '' ||
      value === 'null' ||
      value === null ||
      value === undefined
    ) {
      return null;
    }
    return String(value);
  })
  imageUrl: string | null;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (
      value === '' ||
      value === 'null' ||
      value === null ||
      value === undefined
    ) {
      return null;
    }
    return String(value);
  })
  note: string | null;
  @IsArray()
  @Transform(({ value }) => {
    try {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return [];
    } catch (e) {
      return [];
    }
  })
  declare listUser: string[];
}
