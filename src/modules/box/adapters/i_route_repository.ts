import Unit from '@/core/either/unit';
import RepositoryException from '@/core/erros/repository.exception';
import { AsyncResult } from '@/core/types/async_result';
import RouteEntity from '@/modules/box/domain/route.entity';
import {
  RouteQueryAllObject,
  RouteQueryObject,
} from '@/modules/box/infra/query_object/route_query_object';

export default interface IRouteRepository {
  findById(
    query: RouteQueryObject,
  ): AsyncResult<RepositoryException, RouteEntity>;

  findAll(
    query: RouteQueryAllObject,
  ): AsyncResult<RepositoryException, RouteEntity[]>;

  save(route: RouteEntity): AsyncResult<RepositoryException, RouteEntity>;

  removeBoxByid(
    route: RouteEntity,
  ): AsyncResult<RepositoryException, RouteEntity>;

  addBoxToRoute(
    route: RouteEntity,
  ): AsyncResult<RepositoryException, RouteEntity>;

  deleteRouteById(id: string): AsyncResult<RepositoryException, Unit>;
}
