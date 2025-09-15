import BaseEvent from '@/modules/events/domain/handlers/base_event';
import INotificationMessage from '@/modules/notification/adapters/i_notification_message';
import { NOTIFICATION_SERVICE } from '@/modules/notification/symbols';
import IUserRepository from '@/modules/users/adapters/i_user.repository';
import { USER_REPOSITORY } from '@/modules/users/symbols';
import { Inject, Injectable } from '@nestjs/common';
import { IEventHandler } from '../../domain/handlers/i_event_handler';

export interface PushNotificationEventData extends BaseEvent {
  title: string;
  body: string;
  userId: number;
  data?: Record<string, any>;
}

@Injectable()
export class PushNotificationHandler
  implements IEventHandler<PushNotificationEventData>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationMessage,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  getEventType(): string {
    return 'push_notification';
  }

  async handle(data: PushNotificationEventData): Promise<void> {
    try {
      const userFinder = await this.userRepository.findOne({
        userId: data.userId,
      });
      if (userFinder.isLeft()) {
        return;
      }
      const userFcmToken = userFinder.value.fcmToken;

      if (!userFcmToken) {
        return;
      }

      const result = await this.notificationService.sendNotificationToUser(
        userFcmToken,
        {
          body: data.body,
          title: data.title,
          data: data.data,
        },
      );
      if (result.isLeft()) {
        if (result.value.statusCode === 403) {
          userFinder.value.updateUser({
            fcmToken: null,
          });
          const userSaved = await this.userRepository.save(userFinder.value);

          if (userSaved.isLeft()) {
            return;
          }
        }
        return;
      }
    } catch (error) {
      throw error;
    }
  }
}
