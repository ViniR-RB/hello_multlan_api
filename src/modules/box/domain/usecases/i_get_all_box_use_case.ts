import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity from '../box.entity';

export default interface IGetAllBoxUseCase {
  call(): Promise<Either<ServiceException, Array<GetAllBoxParam>>>;
}
export class GetAllBoxParam {
  id: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  listUser: Array<string>;
  note: string;
  createdAt: Partial<Date>;
  updatedAt: Partial<Date>;
  image: string;
  constructor(
    id: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    signal: number,
    listUser: Array<string>,
    note: string,
    createdAt: Partial<Date>,
    updatedAt: Partial<Date>,
    image: string,
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.signal = signal;
    this.listUser = listUser;
    this.note = note;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.image = image;
  }

  static fromEntity(boxEntity: BoxEntity) {
    return new GetAllBoxParam(
      boxEntity.boxId,
      boxEntity.latitude,
      boxEntity.longitude,
      boxEntity.freeSpace,
      boxEntity.filledSpace,
      boxEntity.signal,
      boxEntity.listUser,
      boxEntity.note,
      boxEntity.createdAt!,
      boxEntity.updatedAt!,
      boxEntity.imageUrl,
    );
  }
}
