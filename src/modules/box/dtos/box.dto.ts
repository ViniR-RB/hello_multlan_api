import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export default class BoxDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
  @IsNotEmpty()
  @IsNumber()
  latitude: number;
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
  @IsNotEmpty()
  @IsNumber()
  freeSpace: number;
  @IsNotEmpty()
  @IsNumber()
  filledSpace: number;
  @IsNotEmpty()
  listUser: Array<string>;
}
