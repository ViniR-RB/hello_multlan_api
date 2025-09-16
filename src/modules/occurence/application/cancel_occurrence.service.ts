import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import ICancelOccurrenceUseCase, {
  CancelOccurrenceParam,
  CancelOccurrenceResponse,
} from '@/modules/occurence/domain/usecases/i_cancel_occurrence_use_case';
import IUserRepository from '@/modules/users/adapters/i_user.repository';

export default class CancelOccurrenceService
  implements ICancelOccurrenceUseCase
{
  constructor(
    private readonly ocurrenceRepository: IOcurrenceRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    param: CancelOccurrenceParam,
  ): AsyncResult<AppException, CancelOccurrenceResponse> {
    const occurenceFinder = await this.ocurrenceRepository.findOne({
      occurrenceId: param.occurrenceId,
      relations: ['users'],
    });
    if (occurenceFinder.isLeft()) {
      return left(occurenceFinder.value);
    }
    const userCanceller = await this.userRepository.findOne({
      userId: param.userCancelingId,
    });
    if (userCanceller.isLeft()) {
      return left(userCanceller.value);
    }

    const occurrence = occurenceFinder.value;

    try {
      occurrence.cancelOccurrence(param.reason, userCanceller.value);
      const occurrenceSaved = await this.ocurrenceRepository.save(occurrence);
      if (occurrenceSaved.isLeft()) {
        return left(occurrenceSaved.value);
      }
      return right(new CancelOccurrenceResponse(occurrenceSaved.value));
    } catch (e) {
      if (e instanceof AppException) {
        return left(e);
      }
      return left(new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, e));
    }
  }
}
