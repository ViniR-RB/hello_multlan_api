import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BoxZone } from '../domain/box.entity';

export default class CreateBoxDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  latitude: number;
  @IsNotEmpty()
  @IsString()
  label: string;
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  longitude: number;
  @IsNotEmpty()
  freeSpace: number;
  @IsNotEmpty()
  filledSpace: number;
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  signal: number;
  @IsArray({})
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsOptional()
  listUser: string[] = [];
  @IsNotEmpty()
  @IsEnum(BoxZone)
  zone: BoxZone;
}
