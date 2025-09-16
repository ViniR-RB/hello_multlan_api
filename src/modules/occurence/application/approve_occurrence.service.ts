import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import IApproveOccurrenceUseCase, {
  ApproveOccurrenceParam,
  ApproveOccurrenceResponse,
} from '@/modules/occurence/domain/usecases/i_approve_occurrence_use_case';
import IUserRepository from '@/modules/users/adapters/i_user.repository';

export default class ApproveOccurrenceService
  implements IApproveOccurrenceUseCase
{
  constructor(
    private readonly occurrenceRepository: IOcurrenceRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    param: ApproveOccurrenceParam,
  ): AsyncResult<AppException, ApproveOccurrenceResponse> {
    const occurenceFinder = await this.occurrenceRepository.findOne({
      occurrenceId: param.occurrenceId,
      relations: ['users'],
    });
    if (occurenceFinder.isLeft()) {
      return left(occurenceFinder.value);
    }
    const userApproverOccurrenceFinder = await this.userRepository.findOne({
      userId: param.userApprovingId,
    });
    if (userApproverOccurrenceFinder.isLeft()) {
      return left(userApproverOccurrenceFinder.value);
    }

    try {
      const occurrence = occurenceFinder.value;
      const userApproving = userApproverOccurrenceFinder.value;

      occurrence.resolveOccurrence(userApproving);

      const occurrenceSaved = await this.occurrenceRepository.save(occurrence);

      if (occurrenceSaved.isLeft()) {
        return left(occurrenceSaved.value);
      }

      return right(new ApproveOccurrenceResponse(occurrenceSaved.value));
    } catch (error) {
      if (error instanceof AppException) {
        return left(error);
      }
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
