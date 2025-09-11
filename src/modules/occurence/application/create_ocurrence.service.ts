import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
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
  ) {}
  async execute(
    param: CreateOcurrenceParam,
  ): AsyncResult<AppException, CreateOcurrenceResponse> {
    const usersResult = await this.userRepository.findManyByIds(param.usersId);

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
    return right(
      new CreateOcurrenceResponse(savedOcurrence.value, missingUsers),
    );
  }
}
