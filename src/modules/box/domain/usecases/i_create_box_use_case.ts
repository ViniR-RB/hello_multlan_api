import FileEntity from '@/modules/upload/domain/file.entity';
import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity, { BoxZone } from '../box.entity';

export default interface ICreateBoxUseCase {
  call(boxData: CreateBoxPrams): Promise<Either<ServiceException, BoxEntity>>;
}

export class CreateBoxPrams {
  label: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  image: FileEntity;
  zone: BoxZone;
  listUser?: Array<string>;
  routeId?: Partial<string | null>;
  constructor(
    label: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    signal: number,
    image: FileEntity,
    zone: BoxZone,
    routeId: Partial<string | null>,
  ) {
    this.label = label;
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.signal = signal;
    this.image = image;
    this.zone = zone;
    this.routeId = routeId;
  }

  toEntity(): BoxEntity {
    return new BoxEntity({
      label: this.label,
      latitude: this.latitude,
      longitude: this.longitude,
      freeSpace: this.freeSpace,
      signal: this.signal,
      filledSpace: this.filledSpace,
      listUser: this.listUser,
      zone: this.zone,
      routeId: this.routeId,
    });
  }
}
