import { IsNotEmpty } from 'class-validator';

export default class UpdateConfigDto {
  @IsNotEmpty()
  value: string | number;
}
