import { AsyncResult } from '@/core/types/async_result';
import SummaryBoxReadModel from '@/modules/box/domain/read-models/summary_box_read_model';
import { Either } from 'src/core/either/either';
import Nil from 'src/core/either/nil';
import RepositoryException from 'src/core/erros/repository.exception';
import BoxEntity from '../domain/box.entity';
import BoxModel from '../infra/model/box.model';

interface BoxSummary {
  total_boxes: string;
  total_customers: string;
}

interface BoxZoneInfo {
  zone: string;
  zone_count: string;
  zone_percentage: string;
}

interface TotalRoutes {
  total_routes: string;
}

export interface BoxSummaryQueryResult {
  summary: BoxSummary;
  zone_info: BoxZoneInfo[];
  total_routes: TotalRoutes[];
}

export default interface IBoxRepository {
  getAllBoxs(): Promise<Either<RepositoryException, Array<BoxModel>>>;
  createBox(boxEntity: BoxEntity): Promise<Either<RepositoryException, Nil>>;
  searchBoxFromIdOrThrow(
    id: string,
  ): Promise<Either<RepositoryException, BoxModel>>;
  updateBox(boxEntity: BoxEntity): Promise<Either<RepositoryException, Nil>>;
  summaryBox(): AsyncResult<RepositoryException, SummaryBoxReadModel>;
  deleteBox(id: string): AsyncResult<RepositoryException, Nil>;
  findByIds(ids: string[]): AsyncResult<RepositoryException, BoxEntity[]>;
}
