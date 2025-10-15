import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import { IEventBus } from '@/modules/events/adapters/i_event_bus';
import { PushNotificationEventData } from '@/modules/events/infra/handlers/push_notification_handler';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import ICreateOcurrenceUseCase, {
  CreateOcurrenceParam,
  CreateOcurrenceResponse,
} from '@/modules/occurence/domain/usecases/i_create_ocurrence_use_case';
import IUserRepository from '@/modules/users/adapters/i_user.repository';

export default class CreateOcurrenceService implements ICreateOcurrenceUseCase {
  constructor(
    private readonly ocurrenceRepository: IOcurrenceRepository,
    private readonly userRepository: IUserRepository,
    private readonly boxRepository: IBoxRepository,
    private readonly eventBus: IEventBus,
  ) {}
  async execute(
    param: CreateOcurrenceParam,
  ): AsyncResult<AppException, CreateOcurrenceResponse> {
    try {
      if (param.boxId) {
        const boxExists = await this.boxRepository.findOne({
          boxId: param.boxId,
        });
        if (boxExists.isLeft()) {
          return left(boxExists.value);
        }
      }

      const usersResult = await this.userRepository.findManyByIds(
        param.usersId,
      );

      if (usersResult.isLeft()) {
        return left(usersResult.value);
      }
      const ocurrence = OccurrenceEntity.create({
        ...param,
        users: usersResult.value,
      });
      const savedOcurrence = await this.ocurrenceRepository.save(ocurrence);

      if (savedOcurrence.isLeft()) {
        return left(savedOcurrence.value);
      }
      const missingUsers = param.usersId.filter(
        id => !usersResult.value.some(user => user.id === id),
      );
      const senderNotification = param.usersId.filter(id =>
        usersResult.value.some(user => user.id === id),
      );

      senderNotification.map(async userId => {
        await this.eventBus.publish<PushNotificationEventData>({
          type: 'push_notification',
          title: `${param.title}`,
          body: `${param.description}`,
          userId: userId,
        });
      });

      return right(
        new CreateOcurrenceResponse(savedOcurrence.value, missingUsers),
      );
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error));
    }
  }
}
