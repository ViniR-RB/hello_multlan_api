import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export default class AddBoxsToRouteDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  boxIds: string[];
}
