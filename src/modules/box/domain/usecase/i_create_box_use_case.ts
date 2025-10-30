import BaseFile from '@/core/interface/base_file';
import UseCase from '@/core/interface/use_case';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';

export default interface ICreateBoxUseCase
  extends UseCase<CreateBoxParam, CreateBoxResponse> {}

export interface CreateBoxParam {
  label: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  zone: BoxZone;
  listUser: string[];
  boxFile: BaseFile;
  routeId: string | null;
  note: string | null;
  createdByUserId: number;
}
export class CreateBoxResponse {
  constructor(public readonly boxEntity: BoxEntity) {}

  fromResponse() {
    return this.boxEntity.toObject();
  }
}
