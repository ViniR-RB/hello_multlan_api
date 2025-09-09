import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';
import RouterRepositoryException from '@/modules/routers/exceptions/router_repository.exception';
import RouterMapper from '@/modules/routers/infra/mapper/router.mapper';
import RouterModel from '@/modules/routers/infra/models/route.model';
import { Repository } from 'typeorm';

export default class RouterRepository implements IRouterRepository {
  constructor(private readonly routeRepository: Repository<RouterModel>) {}
  create(entity: RouterEntity): RouterModel {
    const model = RouterMapper.toModel(entity);
    return this.routeRepository.create(model);
  }
  async save(entity: RouterEntity): AsyncResult<AppException, RouterEntity> {
    try {
      const routerModel = this.create(entity);
      await this.routeRepository.save(routerModel);
      return right(RouterMapper.toEntity(routerModel));
    } catch (error) {
      return left(
        new RouterRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
