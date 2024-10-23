import { IsNotEmpty, IsString } from 'class-validator';

export default class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
