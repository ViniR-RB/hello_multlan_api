import CoreModule from '@/core/core_module';
import {
  FIREBASE_APP,
  firebaseAppProvider,
  firebaseConfigProvider,
} from '@/modules/notification/infra/firebase.providers';
import FirebaseNotificationService from '@/modules/notification/infra/firebase_notification.service';
import { NOTIFICATION_SERVICE } from '@/modules/notification/symbols';
import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Module({
  imports: [CoreModule],
  providers: [
    firebaseConfigProvider,
    firebaseAppProvider,
    {
      inject: [FIREBASE_APP],
      provide: NOTIFICATION_SERVICE,
      useFactory: (firebaseApp: admin.app.App) =>
        new FirebaseNotificationService(firebaseApp),
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export default class NotificationModule {}
