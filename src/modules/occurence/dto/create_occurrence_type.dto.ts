import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class CreateOccurrenceTypeDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
}
