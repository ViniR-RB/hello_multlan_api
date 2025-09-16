import OccurrenceStatus from '@/modules/occurence/domain/entities/occurrence_status';
import OccurrenceDomainException from '@/modules/occurence/exceptions/occurrence_domain.exception';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import { randomUUID } from 'crypto';

interface OccurrenceEntityProps {
  id?: string;
  title: string;
  description: string | null;
  users?: UserEntity[];
  boxId: string | null;
  canceledReason?: string | null;
  status?: OccurrenceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
export default class OccurrenceEntity {
  private constructor(private readonly props: OccurrenceEntityProps) {
    this.props = {
      id: props.id ?? randomUUID().toString(),
      title: props.title,
      description: props.description,
      users: props.users ?? [],
      boxId: props.boxId,
      canceledReason: props.canceledReason,
      status: props.status,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  static create(props: OccurrenceEntityProps) {
    return new OccurrenceEntity({
      ...props,
      canceledReason: null,
      status: OccurrenceStatus.CREATED,
    });
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
      status: this.status,
      canceledReason: this.canceledReason,
      boxId: this.boxId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  cancelOccurrence(reason: string, userCacelled: UserEntity) {
    if (this.status !== OccurrenceStatus.CREATED) {
      throw new OccurrenceDomainException(
        'Only occurrences with status Created can be resolved',
      );
    }
    const usersInOccurrence = this.users.map(user => user.id);
    if (
      userCacelled.userHasAdmin() === true ||
      usersInOccurrence.includes(userCacelled.id) === true
    ) {
      this.props.status = OccurrenceStatus.CANCELLED;
      this.props.canceledReason = reason;
      this.toTouch();
      return;
    }

    throw new OccurrenceDomainException(
      'User not authorized to cancel this occurrence',
    );
  }

  resolveOccurrence(userResolved: UserEntity) {
    if (this.status !== OccurrenceStatus.CREATED) {
      throw new OccurrenceDomainException(
        'Only occurrences with status Created can be resolved',
      );
    }
    const usersInOccurrence = this.users.map(user => user.id);
    if (
      userResolved.userHasAdmin() ||
      usersInOccurrence.includes(userResolved.id)
    ) {
      this.props.status = OccurrenceStatus.RESOLVED;
      this.toTouch();
      return;
    }

    throw new OccurrenceDomainException(
      'User not authorized to resolve this occurrence',
    );
  }

  private toTouch() {
    this.props.updatedAt = new Date();
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
  get status() {
    return this.props.status!;
  }
  get canceledReason() {
    return this.props.canceledReason!;
  }
  get boxId() {
    return this.props.boxId;
  }
  get createdAt() {
    return this.props.createdAt!;
  }
  get updatedAt() {
    return this.props.updatedAt!;
  }
}
