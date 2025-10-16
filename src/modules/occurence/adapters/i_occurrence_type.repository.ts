import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';
import OccurrenceTypeModel from '@/modules/occurence/infra/models/occurrence_type.model';
import { OccurrenceTypeQueryObject } from '@/modules/occurence/infra/query/query_object';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface IOccurrenceTypeRepository
  extends BaseRepository<OccurrenceTypeModel, OccurrenceTypeEntity> {
  findOne(
    query: OccurrenceTypeQueryObject,
  ): AsyncResult<AppException, OccurrenceTypeEntity>;
  findById(id: string): AsyncResult<AppException, OccurrenceTypeEntity>;
  findAll(
    pageOptions: PageOptionsEntity,
    name?: string,
  ): AsyncResult<AppException, PageEntity<OccurrenceTypeEntity>>;
  delete(id: string): AsyncResult<AppException, Unit>;
}
