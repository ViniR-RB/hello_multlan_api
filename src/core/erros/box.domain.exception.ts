export default class BoxDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BoxDomainException';
  }
}
