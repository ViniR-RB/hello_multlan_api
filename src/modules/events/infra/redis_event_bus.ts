import { IEventBus } from '@/modules/events/adapters/i_event_bus';
import { EVENT_QUEUE } from '@/modules/events/symbols';
import { Queue } from 'bull';

export class RedisEventBus implements IEventBus {
  constructor(private readonly queue: Queue) {}

  async publish<T>(event: T): Promise<void> {
    await this.queue.add(EVENT_QUEUE, event);
  }
}
