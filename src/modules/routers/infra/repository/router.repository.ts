import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';
import RouterRepositoryException from '@/modules/routers/exceptions/router_repository.exception';
import RouterMapper from '@/modules/routers/infra/mapper/router.mapper';
import RouterModel from '@/modules/routers/infra/models/route.model';
import { RouterQueryObjects } from '@/modules/routers/infra/query/query_objects';
import { EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';

export default class RouterRepository implements IRouterRepository {
  constructor(private readonly routeRepository: Repository<RouterModel>) {}

  async findMany(
    pageOptions: PageOptionsEntity,
    boxId?: string,
    routerId?: string,
  ): AsyncResult<AppException, PageEntity<RouterEntity>> {
    try {
      let queryBuilder = this.routeRepository.createQueryBuilder('route');
      queryBuilder = queryBuilder.leftJoinAndSelect('route.boxs', 'boxs');

      if (boxId) {
        queryBuilder = queryBuilder.andWhere('boxs.id = :boxId', {
          boxId,
        });
      }
      if (routerId) {
        queryBuilder = queryBuilder.andWhere('route.id = :routerId', {
          routerId,
        });
      }

      queryBuilder = queryBuilder
        .orderBy('route.createdAt', pageOptions.order)
        .skip(pageOptions.skip)
        .take(pageOptions.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMeta = new PageMetaEntity({
        pageOptions,
        itemCount,
      });
      return right(
        new PageEntity(entities.map(RouterMapper.toEntity), pageMeta),
      );
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

  async findOne(
    query: RouterQueryObjects,
  ): AsyncResult<AppException, RouterEntity> {
    try {
      let options: FindOneOptions<RouterModel> = {
        select: query.selectFields,
        relations: query.relations,
      };
      if (query.routerId) {
        options = { ...options, where: { id: query.routerId } };
      }
      return right(
        RouterMapper.toEntity(
          await this.routeRepository.findOneOrFail(options),
        ),
      );
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(
          new RouterRepositoryException(
            ErrorMessages.ROUTER_NOT_FOUND,
            404,
            error,
          ),
        );
      }
      return left(
        new RouterRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
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
