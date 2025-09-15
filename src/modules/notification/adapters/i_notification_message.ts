import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';
import NotificationInterface from '@/modules/notification/domain/entities/notification';

export default interface INotificationMessage {
  sendNotificationToUser(
    token: string,
    payload: NotificationInterface,
  ): AsyncResult<AppException, Unit>;
}
