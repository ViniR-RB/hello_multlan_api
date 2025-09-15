import { Injectable, Logger } from '@nestjs/common';
import { IEventHandler } from '../../domain/handlers/i_event_handler';

export interface EmailNotificationEventData {
  email: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

@Injectable()
export class EmailNotificationHandler
  implements IEventHandler<EmailNotificationEventData>
{
  private readonly logger = new Logger(EmailNotificationHandler.name);

  constructor() // Injete aqui seus serviços de email quando implementar
  // @Inject('EMAIL_SERVICE') private readonly emailService: IEmailService,
  {}

  getEventType(): string {
    return 'email_notification';
  }

  async handle(data: EmailNotificationEventData): Promise<void> {
    this.logger.log(`Processing email notification to: ${data.email}`);

    try {
      // TODO: Implementar lógica de email
      // await this.emailService.sendEmail({
      //   to: data.email,
      //   subject: data.subject,
      //   template: data.template,
      //   data: data.data,
      // });

      // Por enquanto, apenas log
      this.logger.log(`Email sent: ${data.subject} to ${data.email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.email}:`, error);
      throw error;
    }
  }
}
