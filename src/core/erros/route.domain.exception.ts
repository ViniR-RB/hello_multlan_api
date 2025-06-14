export default class RouteDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RouteDomainException';
  }
}
