import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import BoxDomainException from '@/modules/box/exceptions/box_domain.exception';
import { randomUUID } from 'crypto';

interface BoxEntityProps {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  freeSpace: number;
  filledSpace: number;
  signal: number;
  zone: BoxZone;
  listUser: string[];
  routeId: string | null;
  imageUrl: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
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
      listUser: props.listUser,
      routeId: props.routeId,
      imageUrl: props.imageUrl,
      note: props.note,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
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
    if (props.filledSpace !== props.listUser.length) {
      throw new BoxDomainException(
        'Filled space must be equal to the number of users in the box',
      );
    }
    if (props.filledSpace < props.listUser.length) {
      throw new BoxDomainException(
        'Filled space cannot be less than the number of users in the box',
      );
    }
    if (!props.zone) {
      throw new BoxDomainException('Zone is required');
    }
  }
  static create(
    props: Omit<BoxEntityProps, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>,
    id?: string,
  ) {
    const newData: BoxEntityProps = {
      ...props,
      id: id ?? randomUUID().toString(),
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.validate(newData);
    return new BoxEntity(newData);
  }

  static fromData(props: BoxEntityProps) {
    return new BoxEntity(props);
  }

  addRoute(routeId: string) {
    if (this.props.routeId) {
      throw new BoxDomainException('box already has a route assigned');
    }
    this.props.routeId = routeId;
    this.toTouch();
  }
  removeRoute() {
    this.props.routeId = null;
    this.toTouch();
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

  edit(props: Partial<BoxEntityProps>) {
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined),
    ) as Partial<BoxEntityProps>;

    if (
      cleanProps.createdAt ||
      cleanProps.id ||
      cleanProps.updatedAt ||
      cleanProps.routeId
    ) {
      throw new BoxDomainException(
        'ID, createdAt, updatedAt and routeId cannot be updated',
      );
    }

    if (cleanProps.imageUrl) {
      throw new BoxDomainException(
        'Image URL cannot be updated here. Use updateImageUrl method instead',
      );
    }

    const updatedProps = {
      ...this.props,
      ...cleanProps,
    };

    BoxEntity.validate(updatedProps);

    Object.assign(this.props, cleanProps);
    this.toTouch();
  }

  updateBox(props: Partial<BoxEntityProps>) {
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined),
    ) as Partial<BoxEntityProps>;
    if (
      cleanProps.createdAt ||
      cleanProps.id ||
      cleanProps.updatedAt ||
      cleanProps.routeId
    ) {
      throw new BoxDomainException(
        'ID, createdAt, updatedAt and routeId cannot be updated',
      );
    }
    if (cleanProps.imageUrl) {
      throw new BoxDomainException('Image URL cannot be updated here');
    }
    if (cleanProps.label && cleanProps.label.length < 3) {
      throw new BoxDomainException('Label must be at least 3 characters long');
    }
    if (
      cleanProps.filledSpace !== undefined &&
      cleanProps.freeSpace !== undefined &&
      cleanProps.filledSpace > cleanProps.freeSpace
    ) {
      throw new BoxDomainException(
        'Filled space cannot be greater than free space',
      );
    }
    if (
      typeof BoxZone[cleanProps.zone as keyof typeof BoxZone] === 'undefined'
    ) {
      throw new BoxDomainException('Invalid zone');
    }
    if (
      cleanProps.freeSpace &&
      cleanProps.filledSpace &&
      cleanProps.filledSpace > cleanProps.freeSpace
    ) {
      throw new BoxDomainException(
        'Filled space cannot be greater than free space',
      );
    }
    if (
      cleanProps.listUser &&
      cleanProps.filledSpace &&
      cleanProps.listUser?.length > cleanProps.filledSpace
    ) {
      throw new BoxDomainException(
        'Number of users cannot exceed the free space of the box',
      );
    }

    Object.assign(this.props, cleanProps);
    this.toTouch();
  }

  toTouch() {
    this.props.updatedAt = new Date();
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
      listUser: this.listUser,
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
