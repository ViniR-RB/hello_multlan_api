import { IsArray, IsDate, IsString, IsUUID, Length } from 'class-validator';

export default class RouterDto {
  @IsString()
  @IsUUID()
  id: string;
  @IsString()
  @Length(3, 255)
  name: string;

  @IsArray()
  boxs: string[];

  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
