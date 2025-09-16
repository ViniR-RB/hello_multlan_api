import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import { OccurrenceQueryObject } from '@/modules/occurence/infra/query/query_object';

export default interface IOcurrenceRepository
  extends BaseRepository<OccurrenceModel, OccurrenceEntity> {
  findOne(
    query: OccurrenceQueryObject,
  ): AsyncResult<AppException, OccurrenceEntity>;
}
