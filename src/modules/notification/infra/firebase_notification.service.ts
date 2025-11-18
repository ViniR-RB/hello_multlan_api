import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import INotificationMessage from '@/modules/notification/adapters/i_notification_message';
import NotificationInterface from '@/modules/notification/domain/entities/notification';
import NotificationServiceException from '@/modules/notification/exceptions/notification_service.exception';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export default class FirebaseNotificationService
  implements INotificationMessage
{
  constructor(private readonly firebaseApp: admin.app.App) {}

  async sendNotificationToUser(
    token: string,
    payload: NotificationInterface,
  ): AsyncResult<AppException, Unit> {
    try {
      if (!this.firebaseApp) {
        throw NotificationServiceException.serviceNotAvailable();
      }

      const message = {
        token: token,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
        android: {
          priority: 'high' as const,
          notification: {
            channelId: 'default',
            priority: 'high' as const,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };
      console.log('Sending message');
      const messageId = await this.firebaseApp.messaging().send(message);
      console.log('Message sent: ', messageId);
      return right(unit);
    } catch (e) {
      if (e instanceof AppException) {
        return left(e);
      }
      if (e.code in e) {
        if (
          e.code === 'messaging/invalid-argument' ||
          e.code === 'messaging/registration-token-not-registered'
        ) {
          console.log('User token invalid');

          return left(NotificationServiceException.invalidToken(e));
        }
      }
      console.log('Unexpected error when sending notification: ', e);
      return left(new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, e));
    }
  }
}
