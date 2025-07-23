export default class OccurrenceDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OccurrenceDomainException';
  }
}
