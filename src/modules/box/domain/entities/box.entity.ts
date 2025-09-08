import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import BoxDomainException from '@/modules/box/exceptions/box_domain.exception';
import { randomUUID } from 'crypto';

interface BoxEntityProps {
  id?: string;
  label: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  zone: BoxZone;
  listUser?: string[];
  routeId?: string | null;
  imageUrl?: string | null;
  note?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class BoxEntity {
  private constructor(private readonly props: BoxEntityProps) {
    this.props = {
      id: props.id ?? randomUUID().toString(),
      label: props.label,
      latitude: props.latitude,
      longitude: props.longitude,
      freeSpace: props.freeSpace,
      filledSpace: props.filledSpace,
      signal: props.signal,
      zone: props.zone,
      listUser: props.listUser ?? [],
      routeId: props.routeId ?? null,
      imageUrl: props.imageUrl ?? null,
      note: props.note ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  static validate(props: BoxEntityProps) {
    if (props.label.length < 3) {
      throw new BoxDomainException('Label must be at least 3 characters long');
    }
    if (props.filledSpace > props.freeSpace) {
      throw new BoxDomainException(
        'Filled space cannot be greater than free space',
      );
    }
    if (props.zone === undefined) {
      throw new BoxDomainException('Zone is required');
    }
  }
  static create(props: BoxEntityProps) {
    this.validate(props);
    return new BoxEntity(props);
  }

  static fromData(props: BoxEntityProps) {
    return new BoxEntity(props);
  }

  get id() {
    return this.props.id!;
  }

  get label() {
    return this.props.label;
  }

  get latitude() {
    return this.props.latitude;
  }
  get longitude() {
    return this.props.longitude;
  }
  get freeSpace() {
    return this.props.freeSpace;
  }
  get filledSpace() {
    return this.props.filledSpace;
  }
  get signal() {
    return this.props.signal;
  }
  get zone() {
    return this.props.zone;
  }
  get listUser() {
    return this.props.listUser;
  }
  get routeId() {
    return this.props.routeId || null;
  }
  get imageUrl() {
    return this.props.imageUrl || null;
  }
  get note() {
    return this.props.note || null;
  }
  get createdAt() {
    return this.props.createdAt!;
  }
  get updatedAt() {
    return this.props.updatedAt!;
  }

  toObject() {
    return {
      id: this.props.id,
      label: this.label,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      freeSpace: this.props.freeSpace,
      filledSpace: this.props.filledSpace,
      signal: this.props.signal,
      zone: this.props.zone,
      routeId: this.props.routeId,
      imageUrl: this.props.imageUrl,
      note: this.props.note,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  updateImageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl;
    this.props.updatedAt = new Date();
  }
}
