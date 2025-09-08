import AppException from '@/core/exceptions/app_exception';

export default class FileStorageException extends AppException {
  constructor(message: string, statusCode: number = 500, error?: any) {
    super(message, statusCode, error);
  }
}
