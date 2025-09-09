import AppException from '@/core/exceptions/app_exception';

export default class RouterRepositoryException extends AppException {
  constructor(message: string, statusCode?: number, error?: Error) {
    super(message, statusCode, error);
  }
}
