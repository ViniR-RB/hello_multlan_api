import { IsString, Length } from 'class-validator';

export default class CancelOccurrenceDto {
  @IsString()
  @Length(3)
  cancelReason: string;
}
