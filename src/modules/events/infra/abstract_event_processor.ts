import { Logger, OnModuleInit } from '@nestjs/common';
import { Job } from 'bull';
import { EventHandlerRegistry } from '../domain/event_handler_registry';
import { IEventHandler } from '../domain/handlers/i_event_handler';

export abstract class AbstractEventProcessor implements OnModuleInit {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly eventHandlerRegistry: EventHandlerRegistry) {}

  onModuleInit() {
    // Registrar todos os handlers ao inicializar o módulo
    const handlers = this.getEventHandlers();
    handlers.forEach(handler => {
      this.eventHandlerRegistry.register(handler);
      this.logger.log(
        `Registered handler for event type: ${handler.getEventType()}`,
      );
    });

    this.logger.log(
      `Event processor initialized with ${handlers.length} handlers`,
    );
  }

  async processEvent(job: Job<any>) {
    const { type, ...data } = job.data;

    if (!type) {
      this.logger.warn('Event received without type');
      return;
    }

    const handler = this.eventHandlerRegistry.getHandler(type);

    if (!handler) {
      return;
    }

    try {
      console.log(`Processing event: ${type}`);
      await handler.handle(data);
      console.log(`Event ${type} processed successfully`);
    } catch (error) {
      console.error(`Error processing event ${type}:`, error);
      throw error;
    }
  }

  // Método abstrato que deve ser implementado pelas classes filhas
  protected abstract getEventHandlers(): IEventHandler[];
}
