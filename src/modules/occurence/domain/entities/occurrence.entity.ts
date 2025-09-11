import UserEntity from '@/modules/users/domain/entities/user.entity';
import { randomUUID } from 'crypto';

interface OccurrenceEntityProps {
  id?: string;
  title: string;
  description: string | null;
  users?: UserEntity[];
  boxId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export default class OccurrenceEntity {
  private constructor(private readonly props: OccurrenceEntityProps) {
    this.props = {
      id: props.id ?? randomUUID().toString(),
      title: props.title,
      description: props.description ?? null,
      users: props.users ?? [],
      boxId: props.boxId ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  static create(props: OccurrenceEntityProps) {
    return new OccurrenceEntity(props);
  }

  static fromData(props: OccurrenceEntityProps) {
    return new OccurrenceEntity(props);
  }

  toObject() {
    return {
      id: this.id,
      title: this.name,
      description: this.description,
      users: this.users.map(user => user.toObject()),
      boxId: this.boxId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get users() {
    return this.props.users!;
  }
  get boxId() {
    return this.props.boxId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
