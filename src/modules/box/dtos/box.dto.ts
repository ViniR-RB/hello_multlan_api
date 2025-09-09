import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import {
  IsArray,
  IsDate,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export default class BoxDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  @Length(3)
  label: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  freeSpace: number;

  @IsNumber()
  filledSpace: number;

  @IsNumber()
  signal: number;

  @IsEnum(BoxZone)
  zone: BoxZone;

  @IsString()
  @IsEmpty()
  routeId: string | null;

  @IsString()
  @IsOptional()
  imageUrl: string | null;

  @IsString()
  @IsOptional()
  note: string | null;

  @IsArray()
  listUser: string[];

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
