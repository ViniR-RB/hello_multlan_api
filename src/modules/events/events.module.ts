import EventProcessor from '@/modules/events/infra/event_processor';
import { RedisEventBus } from '@/modules/events/infra/redis_event_bus';
import { EVENT_BUS, EVENT_QUEUE } from '@/modules/events/symbols';
import NotificationModule from '@/modules/notification/notification.module';
import UsersModule from '@/modules/users/users.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Queue } from 'bull';
import { EventHandlerRegistry } from './domain/event_handler_registry';
import { EmailNotificationHandler } from './infra/handlers/email_notification_handler';
import { PushNotificationHandler } from './infra/handlers/push_notification_handler';

@Module({
  imports: [
    BullModule.registerQueue({ name: EVENT_QUEUE }),
    NotificationModule,
    UsersModule,
  ],
  providers: [
    EventHandlerRegistry,
    PushNotificationHandler,
    EmailNotificationHandler,

    {
      inject: [`BullQueue_${EVENT_QUEUE}`],
      provide: EVENT_BUS,
      useFactory: (queue: Queue) => new RedisEventBus(queue),
    },
    EventProcessor,
  ],
  exports: [
    {
      inject: [`BullQueue_${EVENT_QUEUE}`],
      provide: EVENT_BUS,
      useFactory: (queue: Queue) => new RedisEventBus(queue),
    },
  ],
})
export default class EventsModule {
  constructor() {}
}
