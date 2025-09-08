import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import BoxModel from '@/modules/box/infra/models/box.model';
import { BoxQueryObject } from '@/modules/box/infra/query/query_object';

export default interface IBoxRepository
  extends BaseRepository<BoxModel, BoxEntity> {
  findOne(query: BoxQueryObject): AsyncResult<AppException, BoxEntity>;
}
