import { AsyncResult } from '@/core/types/async_result';
import { Injectable } from '@nestjs/common';
import { left, right } from 'src/core/either/either';
import OccurrenceDomainException from 'src/core/erros/occurrence.domain.exception';
import ServiceException from 'src/core/erros/service.exception';
import { FirebaseNotificationService } from 'src/core/services/firebase-notification.service';
import IUserRepository from 'src/modules/user/adapters/i_user_repository';
import IOccurrenceRepository from '../adapters/i_occurrence_repository';
import OccurrenceEntity from '../domain/occurrence.entity';
import ICreateOccurrenceUseCase, {
  CreateOccurrenceParams,
} from '../domain/usecases/i_create_occurrence_use_case';

@Injectable()
export default class CreateOccurrenceService
  implements ICreateOccurrenceUseCase
{
  constructor(
    private readonly occurrenceRepository: IOccurrenceRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationService: FirebaseNotificationService,
  ) {}

  async call(
    params: CreateOccurrenceParams,
  ): AsyncResult<ServiceException, OccurrenceEntity> {
    try {
      const occurrence = params.toEntity();

      const result = await this.occurrenceRepository.create(occurrence);

      if (result.isLeft()) {
        return left(result.value);
      }

      // Enviar notificação para usuários internos sobre nova ocorrência
      await this.sendOccurrenceNotification(result.value);

      return right(result.value);
    } catch (error) {
      if (error instanceof OccurrenceDomainException) {
        return left(new ServiceException(error.message, 400));
      }
      if (error instanceof ServiceException) {
        return left(error);
      }
      console.error(error);
      return left(new ServiceException('Unexpected error', 500));
    }
  }

  private async sendOccurrenceNotification(occurrence: OccurrenceEntity) {
    try {
      // Verificar se há um usuário atribuído à ocorrência
      if (!occurrence.receivedByUserId) {
        console.log('No user assigned to occurrence, skipping notification');
        return;
      }

      // Buscar o usuário atribuído
      const userResult = await this.userRepository.findOneById(
        occurrence.receivedByUserId,
      );

      if (userResult.isLeft()) {
        console.error(
          'Failed to fetch assigned user for notification:',
          userResult.value,
        );
        return;
      }

      const assignedUser = userResult.value;

      // Verificar se o usuário tem Firebase ID
      if (!assignedUser.userFirebaseId) {
        console.log('Assigned user has no Firebase ID, skipping notification');
        return;
      }

      const notificationPayload = {
        title: 'Nova Ocorrência Atribuída',
        body: `Uma nova ocorrência foi atribuída para você na caixa ${occurrence.boxId}. Status: ${occurrence.status}`,
        data: {
          occurrenceId: occurrence.occurrenceId,
          boxId: occurrence.boxId,
          status: occurrence.status,
          type: 'new_occurrence_assigned',
        },
      };

      const result = await this.notificationService.sendNotificationToUser(
        assignedUser.userFirebaseId,
        notificationPayload,
      );

      // Log do resultado
      if (result.success) {
        console.log(
          `Notification sent successfully to assigned user: ${assignedUser.userName}`,
        );
      } else {
        console.error(
          'Failed to send notification to assigned user:',
          result.error,
        );
      }
    } catch (error) {
      console.error('Error sending occurrence notification:', error);
    }
  }
}
