import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class FirebaseNotificationService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = this.configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');
      const clientEmail = this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      );

      if (!projectId || !privateKey || !clientEmail) {
        console.warn(
          'Firebase configuration incomplete. Notifications will be disabled.',
        );
        return;
      }

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });

      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }

  async sendNotificationToUser(
    firebaseId: string,
    payload: NotificationPayload,
  ): Promise<NotificationResult> {
    if (!this.firebaseApp) {
      return {
        success: false,
        error: 'Firebase not initialized',
      };
    }

    try {
      const message = {
        token: firebaseId,
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

      const response = await this.firebaseApp.messaging().send(message);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('Failed to send notification:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendNotificationToMultipleUsers(
    firebaseIds: string[],
    payload: NotificationPayload,
  ): Promise<NotificationResult[]> {
    if (!this.firebaseApp) {
      return firebaseIds.map(() => ({
        success: false,
        error: 'Firebase not initialized',
      }));
    }

    try {
      const results: NotificationResult[] = [];

      for (const firebaseId of firebaseIds) {
        try {
          const message = {
            token: firebaseId,
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

          const response = await this.firebaseApp.messaging().send(message);

          results.push({
            success: true,
            messageId: response,
          });
        } catch (error) {
          results.push({
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Failed to send multicast notification:', error);
      return firebaseIds.map(() => ({
        success: false,
        error: error.message,
      }));
    }
  }

  async sendNotificationToTopic(
    topic: string,
    payload: NotificationPayload,
  ): Promise<NotificationResult> {
    if (!this.firebaseApp) {
      return {
        success: false,
        error: 'Firebase not initialized',
      };
    }

    try {
      const message = {
        topic,
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

      const response = await this.firebaseApp.messaging().send(message);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      console.error('Failed to send topic notification:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async subscribeToTopic(
    firebaseIds: string[],
    topic: string,
  ): Promise<boolean> {
    if (!this.firebaseApp) {
      return false;
    }

    try {
      let successCount = 0;

      for (const firebaseId of firebaseIds) {
        try {
          await this.firebaseApp
            .messaging()
            .subscribeToTopic([firebaseId], topic);
          successCount++;
        } catch (error) {
          console.error(
            `Failed to subscribe token ${firebaseId} to topic ${topic}:`,
            error,
          );
        }
      }

      return successCount > 0;
    } catch (error) {
      console.error('Failed to subscribe to topic:', error);
      return false;
    }
  }

  async unsubscribeFromTopic(
    firebaseIds: string[],
    topic: string,
  ): Promise<boolean> {
    if (!this.firebaseApp) {
      return false;
    }

    try {
      // Cancelar inscrição de cada token individualmente
      let successCount = 0;

      for (const firebaseId of firebaseIds) {
        try {
          await this.firebaseApp
            .messaging()
            .unsubscribeFromTopic([firebaseId], topic);
          successCount++;
        } catch (error) {
          console.error(
            `Failed to unsubscribe token ${firebaseId} from topic ${topic}:`,
            error,
          );
        }
      }

      return successCount > 0;
    } catch (error) {
      console.error('Failed to unsubscribe from topic:', error);
      return false;
    }
  }
}
