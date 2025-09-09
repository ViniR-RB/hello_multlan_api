import BoxEntity from '@/modules/box/domain/entities/box.entity';
import { randomUUID } from 'crypto';

interface RouterEntityProps {
  id?: string;
  name: string;
  boxs?: BoxEntity[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default class RouterEntity {
  constructor(private readonly props: RouterEntityProps) {
    this.props = {
      id: props.id ?? randomUUID().toString(),
      name: props.name,
      boxs: props.boxs ?? [],
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }
  static create(props: RouterEntityProps) {
    return new RouterEntity(props);
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
    box.addRoute(this.id);
    this.props.boxs?.push(box);
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      boxs: this.boxs?.map(box => box.toObject()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
