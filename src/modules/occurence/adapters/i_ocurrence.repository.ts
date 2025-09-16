import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceStatus from '@/modules/occurence/domain/entities/occurrence_status';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import { OccurrenceQueryObject } from '@/modules/occurence/infra/query/query_object';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface IOcurrenceRepository
  extends BaseRepository<OccurrenceModel, OccurrenceEntity> {
  findOne(
    query: OccurrenceQueryObject,
  ): AsyncResult<AppException, OccurrenceEntity>;
  findMany(
    pageOptions: PageOptionsEntity,
    status?: OccurrenceStatus,
    boxId?: string,
    userId?: number,
  ): AsyncResult<AppException, PageEntity<OccurrenceEntity>>;
}
