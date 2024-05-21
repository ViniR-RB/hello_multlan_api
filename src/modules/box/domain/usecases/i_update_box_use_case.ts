import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity from '../box.entity';

export default interface IUpdateBoxUseCase {
  call(boxData: UpdateBoxParams): Promise<Either<ServiceException, BoxEntity>>;
}

export class UpdateBoxParams {
  id: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  listUser: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    listUser: Array<string>,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.listUser = listUser;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toEntity() {
    return new BoxEntity(
      {
        latitude: this.latitude,
        longitude: this.longitude,
        freeSpace: this.freeSpace,
        filledSpace: this.filledSpace,
        listUser: this.listUser,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
      this.id,
    );
  }
}
