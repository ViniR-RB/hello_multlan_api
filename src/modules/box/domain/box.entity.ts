import { randomUUID } from 'crypto';
import BoxDomainException from '../../../core/erros/box.domain.exception';

interface BoxEntityProps {
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  listUser?: Partial<Array<string>>;
  createdAt?: Partial<Date>;
  updatedAt?: Partial<Date>;
}

export default class BoxEntity {
  constructor(
    private readonly props: BoxEntityProps,
    private readonly id?: string,
  ) {
    this.props = {
      ...props,
      createdAt: this.props.createdAt || new Date(),
      updatedAt: this.props.updatedAt || new Date(),
      listUser: this.props.listUser || [],
    };
    if (this.props.filledSpace > this.props.freeSpace) {
      throw new BoxDomainException(
        "Filled space can't be greater than free space",
      );
    }
    if (this.props.freeSpace < this.props.listUser.length) {
      throw new BoxDomainException(
        'Free space must be graeter than list user length',
      );
    }
    this.id = id || randomUUID();
  }
  get boxId() {
    return this.id;
  }
  get freeSpace() {
    return this.props.freeSpace;
  }
  get filledSpace() {
    return this.props.filledSpace;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get latitude() {
    return this.props.latitude;
  }
  get longitude() {
    return this.props.longitude;
  }
  get listUser() {
    return this.props.listUser;
  }
}
