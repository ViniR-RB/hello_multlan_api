import RepositoryException from '@/core/erros/repository.exception';

export class UserRepositoryException extends RepositoryException {
  constructor(
    message: string = 'Unexpected error',
    statusCode: number = 400,
    stackStrace: string = '',
  ) {
    super(message, statusCode, stackStrace);
    this.name = 'UserRepositoryException';
  }
}

export class UserRepositoryNotFound extends UserRepositoryException {
  constructor(
    message: string,
    statusCode: number = 404,
    stackStrace: string = '',
  ) {
    super(message, statusCode, stackStrace);
    this.name = 'UserRepositoryNotFound';
  }
}
