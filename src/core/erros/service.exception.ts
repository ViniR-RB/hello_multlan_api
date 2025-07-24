import AppException from '@/core/erros/app.exception';

export default class ServiceException extends AppException {
  constructor(message: string, statusCode: number, stackStrace: string = '') {
    super(message, statusCode, stackStrace);
    this.name = 'ServiceException';
  }
}
