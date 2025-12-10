import { IsNumber, IsString, Length } from 'class-validator';

export default class UpdatePasswordDto {
  @IsNumber()
  userId: number;

  @IsString()
  @Length(6)
  newPassword: string;
  @IsString()
  oldPassword: string;
}
