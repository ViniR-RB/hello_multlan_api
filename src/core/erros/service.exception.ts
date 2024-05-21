export default class ServiceException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ServiceException';
  }
}
