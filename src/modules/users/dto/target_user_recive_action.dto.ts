import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export default class TargetUserReciveActionDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'targetUserId must be a number' })
  @IsPositive({ message: 'targetUserId must be a positive number' })
  @IsNotEmpty({ message: 'targetUserId is required' })
  targetUserId: number;
}
