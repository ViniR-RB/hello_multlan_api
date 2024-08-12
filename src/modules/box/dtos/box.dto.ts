import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export default class BoxDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
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
}
