import { randomUUID } from 'crypto';
import BoxDomainException from '../../../core/erros/box.domain.exception';

export enum BoxZone {
  SAFE = 'SAFE',
  MODERATE = 'MODERATE',
  DANGER = 'DANGER',
}
interface BoxEntityProps {
  label: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  zone: BoxZone;
  routeId?: string | null;
  image?: string;
  note?: string;
  listUser?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default class BoxEntity {
  constructor(
    private readonly props: BoxEntityProps,
    private readonly id?: string,
  ) {
    this.id = id || randomUUID();
    this.props = {
      ...props,
      createdAt: this.props.createdAt || new Date(),
      updatedAt: this.props.updatedAt || new Date(),
      listUser: this.props.listUser || [],
      note: this.props.note || '',
      zone: this.props.zone,
      image: this.props.image || this.id + '.webp',
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
  get zone() {
    return this.props.zone;
  }
  get note() {
    return this.props.note;
  }

  get label() {
    return this.props.label;
  }

  get routeId() {
    return this.props.routeId;
  }

  assignToRoute(routeId: string | null) {
    if (this.props.routeId === routeId) return;
    this.props.routeId = routeId;
    this.touch();
  }

  removeFromRoute() {
    this.props.routeId = null;
    this.touch();
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
        updatedAt: new Date(),
      },
      this.id,
    );
    return boxEntity;
  }

  toObject() {
    return {
      id: this.id,
      ...this.props,
    };
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
