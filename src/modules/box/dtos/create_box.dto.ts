import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateBoxPrams } from '../domain/usecases/i_create_box_use_case';

export default class CreateBoxDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
  @IsNotEmpty()
  freeSpace: number;
  @IsNotEmpty()
  filledSpace: number;

  toParams(): CreateBoxPrams {
    return new CreateBoxPrams(
      this.latitude,
      this.longitude,
      this.freeSpace,
      this.filledSpace,
    );
  }
}
