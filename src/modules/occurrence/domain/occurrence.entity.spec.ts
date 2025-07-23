import OccurrenceDomainException from '../../../core/erros/occurrence.domain.exception';
import OccurrenceEntity, { OccurrenceStatus } from './occurrence.entity';

describe('OccurrenceEntity', () => {
  it('should create an occurrence with default values', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    expect(occurrence.title).toBe('Test Occurrence');
    expect(occurrence.description).toBe(
      'Test Description with more than 10 characters',
    );
    expect(occurrence.status).toBe(OccurrenceStatus.CREATED);
    expect(occurrence.boxId).toBe('box-123');
    expect(occurrence.createdByUserId).toBe('user-123');
    expect(occurrence.note).toBe('');
    expect(occurrence.receivedByUserId).toBeUndefined();
  });

  it('should create an occurrence already assigned to a user', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.RECEIVED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
      receivedByUserId: 'user-456',
    });

    expect(occurrence.title).toBe('Test Occurrence');
    expect(occurrence.description).toBe(
      'Test Description with more than 10 characters',
    );
    expect(occurrence.status).toBe(OccurrenceStatus.RECEIVED);
    expect(occurrence.boxId).toBe('box-123');
    expect(occurrence.createdByUserId).toBe('user-123');
    expect(occurrence.receivedByUserId).toBe('user-456');
    expect(occurrence.note).toBe('');
  });

  it('should throw error when title is too short', () => {
    expect(() => {
      new OccurrenceEntity({
        title: 'Te',
        description: 'Test Description with more than 10 characters',
        status: OccurrenceStatus.CREATED,
        boxId: 'box-123',
        createdByUserId: 'user-123',
      });
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when description is too short', () => {
    expect(() => {
      new OccurrenceEntity({
        title: 'Test Occurrence',
        description: 'Short',
        status: OccurrenceStatus.CREATED,
        boxId: 'box-123',
        createdByUserId: 'user-123',
      });
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when boxId is missing', () => {
    expect(() => {
      new OccurrenceEntity({
        title: 'Test Occurrence',
        description: 'Test Description with more than 10 characters',
        status: OccurrenceStatus.CREATED,
        boxId: '',
        createdByUserId: 'user-123',
      });
    }).toThrow(OccurrenceDomainException);
  });

  it('should assign occurrence to a user', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.assignToUser('user-456');

    expect(occurrence.status).toBe(OccurrenceStatus.RECEIVED);
    expect(occurrence.receivedByUserId).toBe('user-456');
  });

  it('should throw error when trying to assign a closed occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.assignToUser('user-456');
    occurrence.closeOccurrence('user-456');

    expect(() => {
      occurrence.assignToUser('user-789');
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when trying to assign a canceled occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.cancelOccurrence(
      'user-123',
      'This is a valid cancellation reason with more than 10 characters',
    );

    expect(() => {
      occurrence.assignToUser('user-789');
    }).toThrow(OccurrenceDomainException);
  });

  it('should close an occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.assignToUser('user-456');
    occurrence.closeOccurrence('user-456');

    expect(occurrence.status).toBe(OccurrenceStatus.CLOSED);
  });

  it('should throw error when trying to close an unassigned occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    expect(() => {
      occurrence.closeOccurrence('user-123');
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when trying to close a canceled occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.cancelOccurrence(
      'user-123',
      'This is a valid cancellation reason with more than 10 characters',
    );

    expect(() => {
      occurrence.closeOccurrence('user-123');
    }).toThrow(OccurrenceDomainException);
  });

  it('should cancel an occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    const cancellationReason =
      'This is a valid cancellation reason with more than 10 characters';
    occurrence.cancelOccurrence('user-123', cancellationReason);

    expect(occurrence.status).toBe(OccurrenceStatus.CANCELED);
    expect(occurrence.note).toBe(cancellationReason);
  });

  it('should throw error when trying to cancel with short reason', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    expect(() => {
      occurrence.cancelOccurrence('user-123', 'Short');
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when trying to cancel a closed occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.assignToUser('user-456');
    occurrence.closeOccurrence('user-456');

    expect(() => {
      occurrence.cancelOccurrence(
        'user-123',
        'This is a valid cancellation reason with more than 10 characters',
      );
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when trying to cancel an already canceled occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.cancelOccurrence(
      'user-123',
      'This is a valid cancellation reason with more than 10 characters',
    );

    expect(() => {
      occurrence.cancelOccurrence(
        'user-123',
        'This is another valid cancellation reason with more than 10 characters',
      );
    }).toThrow(OccurrenceDomainException);
  });

  it('should update occurrence information', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.updateOccurrence({
      title: 'Updated Title',
      description: 'Updated Description with more than 10 characters',
      note: 'Updated Note',
    });

    expect(occurrence.title).toBe('Updated Title');
    expect(occurrence.description).toBe(
      'Updated Description with more than 10 characters',
    );
    expect(occurrence.note).toBe('Updated Note');
  });

  it('should throw error when updating a canceled occurrence', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    occurrence.cancelOccurrence(
      'user-123',
      'This is a valid cancellation reason with more than 10 characters',
    );

    expect(() => {
      occurrence.updateOccurrence({
        title: 'Updated Title',
      });
    }).toThrow(OccurrenceDomainException);
  });

  it('should throw error when updating with invalid title', () => {
    const occurrence = new OccurrenceEntity({
      title: 'Test Occurrence',
      description: 'Test Description with more than 10 characters',
      status: OccurrenceStatus.CREATED,
      boxId: 'box-123',
      createdByUserId: 'user-123',
    });

    expect(() => {
      occurrence.updateOccurrence({
        title: 'Te',
      });
    }).toThrow(OccurrenceDomainException);
  });
});
