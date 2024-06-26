import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity from '../box.entity';

export default interface ICreateBoxUseCase {
  call(boxData: CreateBoxPrams): Promise<Either<ServiceException, BoxEntity>>;
}

export class CreateBoxPrams {
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  image: string;
  listUser?: Array<string>;
  constructor(
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    image: string,
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.image = image;
  }

  toEntity(): BoxEntity {
    return new BoxEntity({
      latitude: this.latitude,
      longitude: this.longitude,
      freeSpace: this.freeSpace,
      filledSpace: this.filledSpace,
      image: this.image,
      listUser: this.listUser,
    });
  }
}
