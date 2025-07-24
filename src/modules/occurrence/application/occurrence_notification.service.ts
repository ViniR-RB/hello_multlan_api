import { Injectable } from '@nestjs/common';
import {
  FirebaseNotificationService,
  NotificationPayload,
} from 'src/core/services/firebase-notification.service';
import IUserRepository from 'src/modules/user/adapters/i_user_repository';
import { USER_ROLE } from 'src/modules/user/domain/user.entity';
import OccurrenceEntity from '../domain/occurrence.entity';

@Injectable()
export class OccurrenceNotificationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly notificationService: FirebaseNotificationService,
  ) {}

  async notifyNewOccurrence(occurrence: OccurrenceEntity): Promise<void> {
    try {
      const usersResult = await this.userRepository.findAll();

      if (usersResult.isLeft()) {
        console.error(
          'Failed to fetch users for notification:',
          usersResult.value,
        );
        return;
      }

      const users = usersResult.value;
      const internalUsers = users.filter(
        user => user.userRole === USER_ROLE.INTERNAL,
      );

      const usersWithFirebaseId = internalUsers
        .filter(user => user.userFirebaseId)
        .map(user => user.userFirebaseId!);

      if (usersWithFirebaseId.length === 0) {
        console.log('No users with Firebase ID found for notification');
        return;
      }

      const payload: NotificationPayload = {
        title: 'Nova Ocorrência Criada',
        body: `Uma nova ocorrência foi criada no box ${occurrence.boxId}. Status: ${occurrence.status}`,
        data: {
          occurrenceId: occurrence.occurrenceId,
          boxId: occurrence.boxId,
          status: occurrence.status,
          type: 'new_occurrence',
        },
      };

      const results =
        await this.notificationService.sendNotificationToMultipleUsers(
          usersWithFirebaseId,
          payload,
        );

      this.logNotificationResults(results, 'new_occurrence');
    } catch (error) {
      console.error('Error sending new occurrence notification:', error);
    }
  }

  async notifyOccurrenceAssigned(
    occurrence: OccurrenceEntity,
    assignedUserId: string,
  ): Promise<void> {
    try {
      const userResult = await this.userRepository.findOneById(assignedUserId);

      if (userResult.isLeft() || !userResult.value.userFirebaseId) {
        console.log(
          'User not found or no Firebase ID for assignment notification',
        );
        return;
      }

      const payload: NotificationPayload = {
        title: 'Ocorrência Atribuída',
        body: `Uma ocorrência foi atribuída para você. Box: ${occurrence.boxId}`,
        data: {
          occurrenceId: occurrence.occurrenceId,
          boxId: occurrence.boxId,
          status: occurrence.status,
          type: 'occurrence_assigned',
        },
      };

      const result = await this.notificationService.sendNotificationToUser(
        userResult.value.userFirebaseId,
        payload,
      );

      this.logNotificationResults([result], 'occurrence_assigned');
    } catch (error) {
      console.error('Error sending assignment notification:', error);
    }
  }

  async notifyOccurrenceClosed(
    occurrence: OccurrenceEntity,
    closedByUserId: string,
  ): Promise<void> {
    try {
      // Notificar o criador da ocorrência
      const creatorResult = await this.userRepository.findOneById(
        occurrence.createdByUserId,
      );

      if (creatorResult.isRight() && creatorResult.value.userFirebaseId) {
        const payload: NotificationPayload = {
          title: 'Ocorrência Fechada',
          body: `Sua ocorrência no box ${occurrence.boxId} foi fechada.`,
          data: {
            occurrenceId: occurrence.occurrenceId,
            boxId: occurrence.boxId,
            status: occurrence.status,
            type: 'occurrence_closed',
          },
        };

        await this.notificationService.sendNotificationToUser(
          creatorResult.value.userFirebaseId,
          payload,
        );
      }

      // Notificar o usuário que recebeu a ocorrência (se diferente do criador)
      if (
        occurrence.receivedByUserId &&
        occurrence.receivedByUserId !== occurrence.createdByUserId
      ) {
        const receiverResult = await this.userRepository.findOneById(
          occurrence.receivedByUserId,
        );

        if (receiverResult.isRight() && receiverResult.value.userFirebaseId) {
          const payload: NotificationPayload = {
            title: 'Ocorrência Fechada',
            body: `A ocorrência no box ${occurrence.boxId} foi fechada.`,
            data: {
              occurrenceId: occurrence.occurrenceId,
              boxId: occurrence.boxId,
              status: occurrence.status,
              type: 'occurrence_closed',
            },
          };

          await this.notificationService.sendNotificationToUser(
            receiverResult.value.userFirebaseId,
            payload,
          );
        }
      }
    } catch (error) {
      console.error('Error sending close notification:', error);
    }
  }

  async notifyOccurrenceCanceled(
    occurrence: OccurrenceEntity,
    canceledByUserId: string,
  ): Promise<void> {
    try {
      // Notificar o criador da ocorrência
      const creatorResult = await this.userRepository.findOneById(
        occurrence.createdByUserId,
      );

      if (creatorResult.isRight() && creatorResult.value.userFirebaseId) {
        const payload: NotificationPayload = {
          title: 'Ocorrência Cancelada',
          body: `Sua ocorrência no box ${occurrence.boxId} foi cancelada.`,
          data: {
            occurrenceId: occurrence.occurrenceId,
            boxId: occurrence.boxId,
            status: occurrence.status,
            type: 'occurrence_canceled',
          },
        };

        await this.notificationService.sendNotificationToUser(
          creatorResult.value.userFirebaseId,
          payload,
        );
      }

      // Notificar o usuário que recebeu a ocorrência (se diferente do criador)
      if (
        occurrence.receivedByUserId &&
        occurrence.receivedByUserId !== occurrence.createdByUserId
      ) {
        const receiverResult = await this.userRepository.findOneById(
          occurrence.receivedByUserId,
        );

        if (receiverResult.isRight() && receiverResult.value.userFirebaseId) {
          const payload: NotificationPayload = {
            title: 'Ocorrência Cancelada',
            body: `A ocorrência no box ${occurrence.boxId} foi cancelada.`,
            data: {
              occurrenceId: occurrence.occurrenceId,
              boxId: occurrence.boxId,
              status: occurrence.status,
              type: 'occurrence_canceled',
            },
          };

          await this.notificationService.sendNotificationToUser(
            receiverResult.value.userFirebaseId,
            payload,
          );
        }
      }
    } catch (error) {
      console.error('Error sending cancel notification:', error);
    }
  }

  private logNotificationResults(results: any[], type: string): void {
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(
      `[${type}] Notification sent: ${successCount} success, ${failureCount} failures`,
    );

    if (failureCount > 0) {
      console.error(
        `[${type}] Some notifications failed:`,
        results.filter(r => !r.success),
      );
    }
  }
}
