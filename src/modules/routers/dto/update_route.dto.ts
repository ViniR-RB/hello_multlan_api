import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateRouteDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
