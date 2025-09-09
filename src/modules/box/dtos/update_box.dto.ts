import BoxDto from '@/modules/box/dtos/box.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export default class UpdateBoxDto extends PartialType(
  OmitType(BoxDto, ['id', 'createdAt', 'updatedAt', 'imageUrl', 'routeId']),
) {}
