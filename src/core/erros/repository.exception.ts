import AppException from '@/core/erros/app.exception';

export default class RepositoryException extends AppException {
  constructor(
    message: string,
    statusCode: number = 400,
    stackStrace: string = '',
  ) {
    super(message, statusCode, stackStrace);
    this.name = 'RepositoryException';
  }
}
