import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export default class CreateRouteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoxIdDto)
  boxes: Array<BoxIdDto>;

  @IsString()
  name: string;
}

class BoxIdDto {
  @IsString()
  id: string;
}
