import OccurrenceDto from '@/modules/occurence/dto/occurrence.dto';
import { PickType } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

export default class CreateOccurrenceDto extends PickType(OccurrenceDto, [
  'title',
  'description',
  'boxId',
]) {
  @IsArray()
  @IsNumber({}, { each: true })
  declare usersId: number[];

  @IsUUID()
  @IsString()
  occurrenceTypeId: string;
}
