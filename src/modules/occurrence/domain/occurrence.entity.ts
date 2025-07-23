import { randomUUID } from 'crypto';
import OccurrenceDomainException from '../../../core/erros/occurrence.domain.exception';

export enum OccurrenceStatus {
  CREATED = 'CREATED',
  RECEIVED = 'RECEIVED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

interface OccurrenceEntityProps {
  title: string;
  description: string;
  status: OccurrenceStatus;
  boxId: string;
  createdByUserId: string;
  receivedByUserId?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class OccurrenceEntity {
  constructor(
    private readonly props: OccurrenceEntityProps,
    private readonly id?: string,
  ) {
    this.id = id || randomUUID();
    this.props = {
      ...props,
      status: this.props.status || OccurrenceStatus.CREATED,
      createdAt: this.props.createdAt || new Date(),
      updatedAt: this.props.updatedAt || new Date(),
      note: this.props.note || '',
    };

    this.validate();
  }

  private validate() {
    if (!this.props.title || this.props.title.trim().length < 3) {
      throw new OccurrenceDomainException(
        'Title must be at least 3 characters long',
      );
    }

    if (!this.props.description || this.props.description.trim().length < 10) {
      throw new OccurrenceDomainException(
        'Description must be at least 10 characters long',
      );
    }

    if (!this.props.boxId) {
      throw new OccurrenceDomainException('Box ID is required');
    }

    if (!this.props.createdByUserId) {
      throw new OccurrenceDomainException('Created by user ID is required');
    }
  }

  get occurrenceId() {
    return this.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get status() {
    return this.props.status;
  }

  get boxId() {
    return this.props.boxId;
  }

  get createdByUserId() {
    return this.props.createdByUserId;
  }

  get receivedByUserId() {
    return this.props.receivedByUserId;
  }

  get note() {
    return this.props.note;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  assignToUser(userId: string) {
    if (!userId) {
      throw new OccurrenceDomainException(
        'User ID is required to assign occurrence',
      );
    }

    if (this.props.status === OccurrenceStatus.CLOSED) {
      throw new OccurrenceDomainException('Cannot assign a closed occurrence');
    }
    if (this.props.status === OccurrenceStatus.CANCELED) {
      throw new OccurrenceDomainException(
        'Cannot assign a canceled occurrence',
      );
    }
    if (this.props.receivedByUserId !== userId) {
      throw new OccurrenceDomainException(
        'Occurrence cannot be signed by another user',
      );
    }

    this.props.receivedByUserId = userId;
    this.props.status = OccurrenceStatus.RECEIVED;
    this.touch();
  }

  closeOccurrence(userClosingId: string) {
    if (this.props.status === OccurrenceStatus.CREATED) {
      throw new OccurrenceDomainException(
        'Cannot close an occurrence that has not been received',
      );
    }
    if (this.props.status === OccurrenceStatus.CLOSED) {
      throw new OccurrenceDomainException('Occurrence already closed');
    }
    if (this.props.status === OccurrenceStatus.CANCELED) {
      throw new OccurrenceDomainException('Cannot close a canceled occurrence');
    }
    if (
      this.props.receivedByUserId !== userClosingId &&
      this.props.createdByUserId !== userClosingId
    ) {
      throw new OccurrenceDomainException(
        'The occurrence can only be closed by the created user or receiving user',
      );
    }

    this.props.status = OccurrenceStatus.CLOSED;
    this.touch();
  }

  cancelOccurrence(userCancelingId: string, cancellationReason: string) {
    if (this.props.status === OccurrenceStatus.CLOSED) {
      throw new OccurrenceDomainException('Cannot cancel a closed occurrence');
    }
    if (this.props.status === OccurrenceStatus.CANCELED) {
      throw new OccurrenceDomainException('Occurrence already canceled');
    }
    if (
      this.props.receivedByUserId !== userCancelingId &&
      this.props.createdByUserId !== userCancelingId
    ) {
      throw new OccurrenceDomainException(
        'The occurrence can only be canceled by the created user or receiving user',
      );
    }

    if (!cancellationReason || cancellationReason.trim().length < 10) {
      throw new OccurrenceDomainException(
        'Cancellation reason must be at least 10 characters long',
      );
    }

    this.props.status = OccurrenceStatus.CANCELED;
    this.props.note = cancellationReason;
    this.touch();
  }

  updateOccurrence(
    data: Partial<
      Omit<
        OccurrenceEntityProps,
        'createdAt' | 'updatedAt' | 'createdByUserId' | 'boxId' | 'status'
      >
    >,
  ) {
    if (this.props.status === OccurrenceStatus.CANCELED) {
      throw new OccurrenceDomainException(
        'Cannot update a canceled occurrence',
      );
    }

    if (data.title && data.title.trim().length < 3) {
      throw new OccurrenceDomainException(
        'Title must be at least 3 characters long',
      );
    }

    if (data.description && data.description.trim().length < 10) {
      throw new OccurrenceDomainException(
        'Description must be at least 10 characters long',
      );
    }

    if (data.title) {
      this.props.title = data.title;
    }
    if (data.description) {
      this.props.description = data.description;
    }
    if (data.note !== undefined) {
      this.props.note = data.note;
    }
    this.touch();
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
