import { Injectable } from '@nestjs/common';
import { IEventHandler } from './handlers/i_event_handler';

@Injectable()
export class EventHandlerRegistry {
  private handlers = new Map<string, IEventHandler>();

  register(handler: IEventHandler): void {
    this.handlers.set(handler.getEventType(), handler);
  }

  getHandler(eventType: string): IEventHandler | undefined {
    return this.handlers.get(eventType);
  }

  getAllHandlers(): IEventHandler[] {
    return Array.from(this.handlers.values());
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}
