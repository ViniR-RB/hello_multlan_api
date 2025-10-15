import AppException from '@/core/exceptions/app_exception';

export default class ConfigRepositoryException extends AppException {
  constructor(message: string, statusCode: number, cause?: Error) {
    super(message, statusCode, cause);
  }

  static notFound(id: string) {
    return new ConfigRepositoryException(`Config with id ${id} not found`, 404);
  }
}
