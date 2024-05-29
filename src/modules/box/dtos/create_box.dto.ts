import { IsNotEmpty } from 'class-validator';

export default class CreateBoxDto {
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
  @IsNotEmpty()
  freeSpace: number;
  @IsNotEmpty()
  filledSpace: number;
}
