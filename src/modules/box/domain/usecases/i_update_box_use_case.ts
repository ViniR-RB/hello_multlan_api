import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity from '../box.entity';

export default interface IUpdateBoxUseCase {
  call(
    boxData: UpdateBoxParams,
  ): Promise<Either<ServiceException, UpdateBoxResponse>>;
}

export class UpdateBoxResponse {
  constructor(
    public readonly id: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly freeSpace: number,
    public readonly filledSpace: number,
    public readonly listUser: Array<string>,
    public readonly note: string,
    public readonly createdAt: Partial<Date>,
    public readonly updatedAt: Partial<Date>,
  ) {}

  static toResponse(box: BoxEntity) {
    return new UpdateBoxResponse(
      box.boxId,
      box.latitude,
      box.longitude,
      box.freeSpace,
      box.filledSpace,
      box.listUser,
      box.note,
      box.createdAt,
      box.updatedAt,
    );
  }

  toJson() {
    return {
      ...this,
    };
  }
}

export class UpdateBoxParams {
  id: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  listUser: Array<string>;
  note: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    listUser: Array<string>,
    note: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.listUser = listUser;
    this.note = note;
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
        note: this.note,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        image: '',
      },
      this.id,
    );
  }
}
