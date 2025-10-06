import { IsString, Length } from 'class-validator';

export default class UpdateMyPasswordDto {
  @IsString()
  @Length(6)
  newPassword: string;
  @IsString()
  @Length(6)
  oldPassword: string;
}
