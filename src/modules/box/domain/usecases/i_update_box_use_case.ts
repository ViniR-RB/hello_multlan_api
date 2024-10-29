import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import BoxEntity, { BoxZone } from '../box.entity';

export default interface IUpdateBoxUseCase {
  call(
    boxData: UpdateBoxParams,
  ): Promise<Either<ServiceException, UpdateBoxResponse>>;
}

export class UpdateBoxResponse {
  constructor(
    public readonly id: string,
    public readonly label: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly freeSpace: number,
    public readonly filledSpace: number,
    public readonly signal: number,
    public readonly listUser: Array<string>,
    public readonly note: string,
    public readonly image: string,
    public readonly zone: BoxZone,
    public readonly createdAt: Partial<Date>,
    public readonly updatedAt: Partial<Date>,
  ) {}

  static toResponse(box: BoxEntity) {
    return new UpdateBoxResponse(
      box.boxId,
      box.label,
      box.latitude,
      box.longitude,
      box.freeSpace,
      box.filledSpace,
      box.signal,
      box.listUser,
      box.note,
      box.imageUrl,
      box.zone,
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
  label: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  listUser: Array<string>;
  note: string;
  zone: BoxZone;
  createdAt: Date;
  updatedAt: Date;
  constructor(
    id: string,
    label: string,
    latitude: number,
    longitude: number,
    freeSpace: number,
    filledSpace: number,
    signal: number,
    listUser: Array<string>,
    note: string,
    zone: BoxZone,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.label = label;
    this.latitude = latitude;
    this.longitude = longitude;
    this.freeSpace = freeSpace;
    this.filledSpace = filledSpace;
    this.signal = signal;
    this.listUser = listUser;
    this.note = note;
    this.zone = zone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toEntity() {
    return new BoxEntity(
      {
        label: this.label,
        latitude: this.latitude,
        longitude: this.longitude,
        freeSpace: this.freeSpace,
        filledSpace: this.filledSpace,
        signal: this.signal,
        listUser: this.listUser,
        note: this.note,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        image: '',
        zone: this.zone,
      },
      this.id,
    );
  }
}
