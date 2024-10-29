import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BoxZone } from '../domain/box.entity';

export default class BoxDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
  @IsNotEmpty()
  @IsString()
  label: string;
  @IsNotEmpty()
  @IsNumber()
  freeSpace: number;
  @IsNotEmpty()
  @IsNumber()
  filledSpace: number;
  @IsNotEmpty()
  @IsNumber()
  signal: number;
  @IsNotEmpty()
  listUser: Array<string>;
  @IsNotEmpty()
  note: string;
  @IsNotEmpty()
  @IsEnum(BoxZone)
  zone: BoxZone;
}
