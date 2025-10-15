import OccurrenceTypeDomainException from '@/modules/occurence/exceptions/occurrence_type_domain.exception';
import { randomUUID } from 'crypto';

interface OccurrenceTypeEntityProps {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class OccurrenceTypeEntity {
  private constructor(private readonly props: OccurrenceTypeEntityProps) {
    this.props = {
      id: props.id,
      name: props.name,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  private static validate(props: Partial<OccurrenceTypeEntityProps>) {
    if (props.name !== undefined && props.name.trim().length < 3) {
      throw new OccurrenceTypeDomainException(
        'Name must be at least 3 characters long',
      );
    }
    if (props.name !== undefined && props.name.trim().length > 50) {
      throw new OccurrenceTypeDomainException(
        'Name must be at most 50 characters long',
      );
    }
  }

  static create(
    props: Omit<OccurrenceTypeEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    this.validate(props);
    return new OccurrenceTypeEntity({
      id: id || randomUUID().toString(),
      name: props.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: OccurrenceTypeEntityProps) {
    return new OccurrenceTypeEntity(props);
  }

  updateName(name: string) {
    OccurrenceTypeEntity.validate({ name });
    this.props.name = name.trim();
    this.toTouch();
  }

  private toTouch() {
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  toObject() {
    return {
      id: this.props.id,
      name: this.props.name,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
