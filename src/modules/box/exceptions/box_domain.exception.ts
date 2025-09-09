import AppException from '@/core/exceptions/app_exception';

export default class BoxDomainException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
  }
}
