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
  listUser: Array<string>;
  createdAt: Partial<Date>;
  updatedAt: Partial<Date>;

  constructor(
    id: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    listUser: Array<string>,
    createdAt: Partial<Date>,
    updatedAt: Partial<Date>,
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

  static fromEntity(boxEntity: BoxEntity) {
    return new GetAllBoxParam(
      boxEntity.boxId,
      boxEntity.latitude,
      boxEntity.longitude,
      boxEntity.freeSpace,
      boxEntity.filledSpace,
      boxEntity.listUser,
      boxEntity.createdAt!,
      boxEntity.updatedAt!,
    );
  }
}
