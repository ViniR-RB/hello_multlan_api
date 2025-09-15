import CoreModule from '@/core/core_module';
import ConfigurationService from '@/core/services/configuration.service';
import FirebaseNotificationService from '@/modules/notification/infra/firebase_notification.service';
import { NOTIFICATION_SERVICE } from '@/modules/notification/symbols';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [
    {
      inject: [ConfigurationService],
      provide: NOTIFICATION_SERVICE,
      useFactory: (configService: ConfigurationService) => {
        return new FirebaseNotificationService(configService);
      },
    },
  ],
  exports: [
    {
      inject: [ConfigurationService],
      provide: NOTIFICATION_SERVICE,
      useFactory: (configService: ConfigurationService) => {
        return new FirebaseNotificationService(configService);
      },
    },
  ],
})
export default class NotificationModule {}
