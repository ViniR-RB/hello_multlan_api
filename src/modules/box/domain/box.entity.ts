import { randomUUID } from 'crypto';
import BoxDomainException from '../../../core/erros/box.domain.exception';

interface BoxEntityProps {
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  image: string;
  note?: Partial<string>;
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
      note: this.props.note || '',
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
  get signal() {
    return this.props.signal;
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
  get imageUrl() {
    return this.props.image;
  }

  get note() {
    return this.props.note;
  }

  updatedBox(
    boxprops?: Omit<BoxEntityProps, 'createdAt' | 'updatedAt' | 'image'>,
  ) {
    const boxEntity: BoxEntity = new BoxEntity(
      {
        ...this.props,
        ...Object.fromEntries(
          Object.entries(boxprops || {}).filter(
            ([, value]) => value !== undefined,
          ),
        ),
        createdAt: this.createdAt,
      },
      this.id,
    );
    return boxEntity;
  }

  toObject() {
    return {
      ...this,
    };
  }
}
