import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class CreateConfigDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  key: string;

  @IsNotEmpty()
  value: string | number;
}
