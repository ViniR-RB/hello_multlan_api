import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export default class CreateBoxDto {
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
  @IsNotEmpty()
  freeSpace: number;
  @IsNotEmpty()
  filledSpace: number;
  @IsArray({})
  @IsOptional()
  listUser: string[] = [];
}
