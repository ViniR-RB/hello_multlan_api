// Exemplo de como usar em um use case

import { IEventBus } from '@/modules/events/adapters/i_event_bus';
import { EVENT_BUS } from '@/modules/events/symbols';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ExampleUseCase {
  constructor(@Inject(EVENT_BUS) private readonly eventBus: IEventBus) {}

  async execute() {
    // Disparar push notification
    await this.eventBus.publish({
      type: 'push_notification',
      userId: 'user-123',
      title: 'Nova mensagem',
      body: 'Você tem uma nova mensagem',
      data: {
        boxId: 'box-456',
        action: 'view_message',
      },
    });

    // Disparar email notification
    await this.eventBus.publish({
      type: 'email_notification',
      email: 'user@example.com',
      subject: 'Bem-vindo ao sistema',
      template: 'welcome',
      data: {
        name: 'João Silva',
        activationCode: '123456',
      },
    });
  }
}
