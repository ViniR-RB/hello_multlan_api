export default class AppException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly stackStrace: string = '',
  ) {
    super(message);
    this.name = 'AppException';
    this.statusCode = statusCode;
    this.stackStrace = stackStrace;
  }
}
