import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export default class CreateOccurrenceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  boxId: string;

  @IsNotEmpty()
  @IsUUID()
  assignedToUserId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
