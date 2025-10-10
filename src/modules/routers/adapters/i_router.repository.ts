import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';
import RouterModel from '@/modules/routers/infra/models/route.model';
import { RouterQueryObjects } from '@/modules/routers/infra/query/query_objects';

export default interface IRouterRepository
  extends BaseRepository<RouterModel, RouterEntity> {
  findAll(): AsyncResult<AppException, RouterEntity[]>;
  findOne(query: RouterQueryObjects): AsyncResult<AppException, RouterEntity>;
  findMany(
    pageOptions: PageOptionsEntity,
    boxId?: string,
    routerId?: string,
  ): AsyncResult<AppException, PageEntity<RouterEntity>>;
}
