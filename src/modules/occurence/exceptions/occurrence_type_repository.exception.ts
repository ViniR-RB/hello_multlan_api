import ServiceException from '@/core/exceptions/service.exception';

export default class OccurrenceTypeRepositoryException extends ServiceException {
  static notFound(id: string): OccurrenceTypeRepositoryException {
    return new OccurrenceTypeRepositoryException(
      `Occurrence type with id ${id} not found`,
      404,
    );
  }
}
