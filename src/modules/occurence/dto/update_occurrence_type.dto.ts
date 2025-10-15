import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class UpdateOccurrenceTypeDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
}
