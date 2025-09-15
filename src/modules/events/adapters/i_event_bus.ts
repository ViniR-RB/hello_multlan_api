export interface IEventBus {
  publish<T>(event: T): Promise<void>;
}
