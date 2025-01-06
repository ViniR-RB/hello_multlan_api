import { left, right } from '@/core/either/either';
import Nil, { nil } from '@/core/either/nil';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IBoxRepository from '../adapters/i_box_repository';
import IDeleteBoxUseCase from '../domain/usecases/i_delete_box_use_case';

export default class DeleteBoxService implements IDeleteBoxUseCase {
  constructor(private readonly boxRepository: IBoxRepository) {}
  async call(id: string): AsyncResult<ServiceException, Nil> {
    const result = await this.boxRepository.deleteBox(id);
    if (result.isLeft()) {
      return left(new ServiceException(result.value.message, 500));
    }
    return right(nil);
  }
}
