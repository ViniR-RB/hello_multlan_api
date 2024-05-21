import { PartialType } from '@nestjs/mapped-types';
import BoxDto from './box.dto';
export default class UpdatedBoxDto extends PartialType(BoxDto) {}
