import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  listUser: string[] = [];
}
