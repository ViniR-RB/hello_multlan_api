import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity from '../box.entity';

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
  image: string;
  listUser?: Array<string>;
  constructor(
    label: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    signal: number,
    image: string,
  ) {
    this.label = label;
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.signal = signal;
    this.image = image;
  }

  toEntity(): BoxEntity {
    return new BoxEntity({
      label: this.label,
      latitude: this.latitude,
      longitude: this.longitude,
      freeSpace: this.freeSpace,
      signal: this.signal,
      filledSpace: this.filledSpace,
      image: this.image,
      listUser: this.listUser,
    });
  }
}
