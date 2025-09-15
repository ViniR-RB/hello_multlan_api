import { EVENT_QUEUE } from '@/modules/events/symbols';
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { EventHandlerRegistry } from '../domain/event_handler_registry';
import { IEventHandler } from '../domain/handlers/i_event_handler';
import { AbstractEventProcessor } from './abstract_event_processor';
import { EmailNotificationHandler } from './handlers/email_notification_handler';
import { PushNotificationHandler } from './handlers/push_notification_handler';

@Injectable()
@Processor(EVENT_QUEUE)
export default class EventProcessor extends AbstractEventProcessor {
  constructor(
    eventHandlerRegistry: EventHandlerRegistry,
    private readonly pushNotificationHandler: PushNotificationHandler,
    private readonly emailNotificationHandler: EmailNotificationHandler,
  ) {
    super(eventHandlerRegistry);
  }

  @Process(EVENT_QUEUE)
  async handleEvent(job: Job<any>) {
    await this.processEvent(job);
  }

  protected getEventHandlers(): IEventHandler[] {
    return [
      this.pushNotificationHandler,
      this.emailNotificationHandler,
      // Adicione outros handlers aqui conforme necessário
    ];
  }
}
