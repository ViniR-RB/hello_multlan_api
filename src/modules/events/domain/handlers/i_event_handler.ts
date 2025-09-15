export interface IEventHandler<T = any> {
  handle(data: T): Promise<void>;
  getEventType(): string;
}
