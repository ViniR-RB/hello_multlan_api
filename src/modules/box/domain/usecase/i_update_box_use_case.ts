import BaseFile from '@/core/interface/base_file';
import UseCase from '@/core/interface/use_case';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';

export default interface IUpdateBoxUseCase
  extends UseCase<UpdateBoxParam, UpdateBoxResponse> {}

export interface UpdateBoxParam {
  id: string;
  label?: string;
  latitude?: number;
  longitude?: number;
  freeSpace?: number;
  filledSpace?: number;
  signal?: number;
  zone?: BoxZone;
  routeId?: string | null;
  note?: string | null;
  listUser?: string[];
  boxFile?: BaseFile;
}
export class UpdateBoxResponse {
  constructor(public readonly boxEntity: BoxEntity) {}

  fromResponse() {
    return this.boxEntity.toObject();
  }
}
