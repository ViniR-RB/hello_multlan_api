import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';
import ConfigModel from '@/modules/config/infra/models/config.model';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface IConfigRepository
  extends BaseRepository<ConfigModel, ConfigEntity> {
  findById(id: string): AsyncResult<AppException, ConfigEntity>;
  findByKey(key: string): AsyncResult<AppException, ConfigEntity>;
  findAll(
    pageOptions: PageOptionsEntity,
  ): AsyncResult<AppException, PageEntity<ConfigEntity>>;
  delete(id: string): AsyncResult<AppException, Unit>;
}
