import BoxEntity from '@/modules/box/domain/entities/box.entity';
import RouteDomainException from '@/modules/routers/exceptions/route_domain.exception';
import { randomUUID } from 'crypto';

interface RouterEntityProps {
  id: string;
  name: string;
  boxs: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default class RouterEntity {
  constructor(private readonly props: RouterEntityProps) {
    this.props = {
      id: props.id,
      name: props.name,
      boxs: props.boxs ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }
  static create(
    props: Omit<RouterEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    return new RouterEntity({
      ...props,
      id: randomUUID().toString(),
      boxs: props.boxs,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: RouterEntityProps) {
    return new RouterEntity(props);
  }
  get id() {
    return this.props.id!;
  }
  get name() {
    return this.props.name;
  }
  get boxs() {
    return this.props.boxs;
  }
  get createdAt() {
    return this.props.createdAt!;
  }
  get updatedAt() {
    return this.props.updatedAt!;
  }

  addBox(box: BoxEntity) {
    if (this.props.boxs!.some(boxId => boxId === box.id)) {
      throw new RouteDomainException('Box already in route');
    }
    box.addRoute(this.id);
    this.props.boxs?.push(box.id);
  }

  removeBox(box: BoxEntity) {
    const boxFinder = this.props.boxs?.find(boxId => boxId === box.id);
    if (!boxFinder) {
      throw new RouteDomainException('Box not found in route');
    }
    box.removeRoute();
    this.props.boxs = this.props.boxs?.filter(boxId => boxId !== box.id);
    this.toTouch();
  }

  private toTouch() {
    this.props.updatedAt = new Date();
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      boxs: this.boxs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
