import ConfigurationService from '@/core/services/configuration.service';
import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface FirebaseConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export const FIREBASE_CONFIG = 'FIREBASE_CONFIG';
export const FIREBASE_APP = 'FIREBASE_APP';

export const firebaseConfigProvider: Provider = {
  provide: FIREBASE_CONFIG,
  inject: [ConfigurationService],
  useFactory: (configService: ConfigurationService): FirebaseConfig => {
    const projectId = configService.get('FIREBASE_PROJECT_ID');
    const privateKey = configService
      .get('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');
    const clientEmail = configService.get('FIREBASE_CLIENT_EMAIL');

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error(
        'Firebase configuration is missing required environment variables',
      );
    }

    return {
      projectId,
      privateKey,
      clientEmail,
    };
  },
};

export const firebaseAppProvider: Provider = {
  provide: FIREBASE_APP,
  inject: [FIREBASE_CONFIG],
  useFactory: (config: FirebaseConfig): admin.app.App => {
    if (admin.apps.length > 0) {
      return admin.app();
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.projectId,
        privateKey: config.privateKey,
        clientEmail: config.clientEmail,
      }),
    });
  },
};
