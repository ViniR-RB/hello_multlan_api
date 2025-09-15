import AppException from '@/core/exceptions/app_exception';

export default class NotificationServiceException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
  }

  static serviceNotAvailable(error?: Error) {
    return new NotificationServiceException(
      'Notification service is not available',
      503,
      error,
    );
  }
  static invalidToken(error?: Error) {
    return new NotificationServiceException(
      'Invalid notification token',
      404,
      error,
    );
  }
}
