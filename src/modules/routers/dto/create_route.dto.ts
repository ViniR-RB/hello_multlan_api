import RouterDto from '@/modules/routers/dto/route.dto';
import { PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export default class CreateRouterDto extends PickType(RouterDto, ['name']) {
  @IsUUID('all', { each: true })
  declare boxes: string[];
}
