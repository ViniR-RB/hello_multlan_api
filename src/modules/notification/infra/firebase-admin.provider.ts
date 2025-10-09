import ConfigurationService from '@/core/services/configuration.service';
import NotificationServiceException from '@/modules/notification/exceptions/notification_service.exception';
import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN_PROVIDER = 'FIREBASE_ADMIN_PROVIDER';

export const firebaseAdminProvider: Provider = {
  provide: FIREBASE_ADMIN_PROVIDER,
  inject: [ConfigurationService],
  useFactory: async (
    configService: ConfigurationService,
  ): Promise<admin.app.App> => {
    try {
      if (admin.apps.length > 0) {
        console.log('Using existing Firebase app instance');
        return admin.app();
      }

      const projectId = configService.get('FIREBASE_PROJECT_ID');
      const privateKey = configService
        .get('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');
      const clientEmail = configService.get('FIREBASE_CLIENT_EMAIL');

      console.log('Initializing Firebase Admin SDK...');
      const app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });

      return app;
    } catch (error) {
      throw NotificationServiceException.serviceNotAvailable(error);
    }
  },
};
