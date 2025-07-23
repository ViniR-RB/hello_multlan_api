import { RolesGuard } from '@/core/guards/role.guard';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import {
  FirebaseNotificationService,
  NotificationPayload,
} from 'src/core/services/firebase-notification.service';

interface SendNotificationDto {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

interface SendToUserDto extends SendNotificationDto {
  userId: string;
}

interface SendToTopicDto extends SendNotificationDto {
  topic: string;
}

interface SubscribeToTopicDto {
  userId: string;
  topic: string;
}

@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: FirebaseNotificationService,
  ) {}

  @Post('send-to-user')
  async sendToUser(@Body() dto: SendToUserDto) {
    const payload: NotificationPayload = {
      title: dto.title,
      body: dto.body,
      data: dto.data,
      imageUrl: dto.imageUrl,
    };

    const result = await this.notificationService.sendNotificationToUser(
      dto.userId,
      payload,
    );

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  }

  @Post('send-to-topic')
  async sendToTopic(@Body() dto: SendToTopicDto) {
    const payload: NotificationPayload = {
      title: dto.title,
      body: dto.body,
      data: dto.data,
      imageUrl: dto.imageUrl,
    };

    const result = await this.notificationService.sendNotificationToTopic(
      dto.topic,
      payload,
    );

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  }

  @Post('subscribe-to-topic')
  async subscribeToTopic(@Body() dto: SubscribeToTopicDto) {
    const success = await this.notificationService.subscribeToTopic(
      [dto.userId],
      dto.topic,
    );

    return {
      success,
      message: success
        ? 'Successfully subscribed to topic'
        : 'Failed to subscribe to topic',
    };
  }

  @Post('unsubscribe-from-topic')
  async unsubscribeFromTopic(@Body() dto: SubscribeToTopicDto) {
    const success = await this.notificationService.unsubscribeFromTopic(
      [dto.userId],
      dto.topic,
    );

    return {
      success,
      message: success
        ? 'Successfully unsubscribed from topic'
        : 'Failed to unsubscribe from topic',
    };
  }

  @Get('test/:userId')
  async testNotification(@Param('userId') userId: string) {
    const payload: NotificationPayload = {
      title: 'Teste de Notificação',
      body: 'Esta é uma notificação de teste do sistema.',
      data: {
        type: 'test',
        timestamp: new Date().toISOString(),
      },
    };

    const result = await this.notificationService.sendNotificationToUser(
      userId,
      payload,
    );

    return {
      success: result.success,
      messageId: result.messageId,
      error: result.error,
    };
  }
}
