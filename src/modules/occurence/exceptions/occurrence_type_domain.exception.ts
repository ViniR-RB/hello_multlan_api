import AppException from '@/core/exceptions/app_exception';

export default class OccurrenceTypeDomainException extends AppException {
  constructor(message: string, cause?: Error) {
    super(message, 400, cause);
  }
}
