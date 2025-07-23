import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class CancelOccurrenceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'Cancellation reason must be at least 10 characters long',
  })
  cancellationReason: string;
}
