import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import ConfigurationService from '@/core/services/configuration.service';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import INotificationMessage from '@/modules/notification/adapters/i_notification_message';
import NotificationInterface from '@/modules/notification/domain/entities/notification';
import NotificationServiceException from '@/modules/notification/exceptions/notification_service.exception';
import { OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

export default class FirebaseNotificationService
  implements INotificationMessage, OnModuleInit
{
  private firebaseApp: admin.app.App;

  onModuleInit() {
    this.initializeFirebase();
  }
  constructor(private readonly configurationService: ConfigurationService) {}

  private initializeFirebase() {
    try {
      if (admin.apps.length > 0) {
        this.firebaseApp = admin.app();
        console.log('Using existing Firebase app');
        return;
      }
      const projectId = this.configurationService.get('FIREBASE_PROJECT_ID');
      const privateKey = this.configurationService
        .get('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');

      const clientEmail = this.configurationService.get(
        'FIREBASE_CLIENT_EMAIL',
      );

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });
    } catch (e) {
      throw NotificationServiceException.serviceNotAvailable(e);
    }
  }

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
      await this.firebaseApp.messaging().send(message);

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
      return left(new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, e));
    }
  }
}
