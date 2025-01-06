import { AsyncResult } from '@/core/types/async_result';
import { Either } from 'src/core/either/either';
import Nil from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import BoxEntity from '../domain/box.entity';
import SummaryBoxDto from '../dtos/summary.dto';
import BoxModel from '../infra/model/box.model';

export default interface IBoxRepository {
  getAllBoxs(): Promise<Either<RepositoryException, Array<BoxModel>>>;
  createBox(boxEntity: BoxEntity): Promise<Either<RepositoryException, Nil>>;
  searchBoxFromIdOrThrow(
    id: string,
  ): Promise<Either<RepositoryException, BoxModel>>;
  updateBox(boxEntity: BoxEntity): Promise<Either<RepositoryException, Nil>>;
  summaryBox(): AsyncResult<RepositoryException, SummaryBoxDto>;
  deleteBox(id: string): AsyncResult<RepositoryException, Nil>;
}
