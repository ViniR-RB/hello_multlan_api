import { left, right } from '@/core/either/either';
import Unit, { unit } from '@/core/either/unit';
import RepositoryException from '@/core/erros/repository.exception';
import { AsyncResult } from '@/core/types/async_result';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import RouteEntity from '@/modules/box/domain/route.entity';
import { RouteMapper } from '@/modules/box/infra/mapper/route_mapper';
import RouteModel from '@/modules/box/infra/model/route.model';
import {
  RouteQueryAllObject,
  RouteQueryObject,
} from '@/modules/box/infra/query_object/route_query_object';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

export default class RouteRepository implements IRouteRepository {
  constructor(
    @InjectRepository(RouteModel)
    private readonly routeRepository: Repository<RouteModel>,
  ) {}
  async findById(
    query: RouteQueryObject,
  ): AsyncResult<RepositoryException, RouteEntity> {
    try {
      const options: FindOneOptions<RouteModel> = {
        where: { id: query.routeId },
        select: query.select,
        relations: query.relations,
      };

      const routeFinder = await this.routeRepository.findOneOrFail(options);
      return right(RouteMapper.toEntity(routeFinder));
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(new RepositoryException('Route not found'));
      }
      return left(new RepositoryException('Error finding route'));
    }
  }
  async findAll(
    query: RouteQueryAllObject,
  ): AsyncResult<RepositoryException, RouteEntity[]> {
    try {
      const options: FindManyOptions<RouteModel> = {
        select: query.select,
        relations: query.relations,
      };
      const routeList = await this.routeRepository.find(options);
      return right(routeList.map(route => RouteMapper.toEntity(route)));
    } catch (error) {
      return left(new RepositoryException('Error finding routes'));
    }
  }
  async removeBoxByid(
    route: RouteEntity,
  ): AsyncResult<RepositoryException, RouteEntity> {
    try {
      const routeData = RouteMapper.toModel(route);
      const result = await this.routeRepository.save(routeData);
      return right(RouteMapper.toEntity(result));
    } catch (error) {
      return left(new RepositoryException('Error removing box from route'));
    }
  }
  async addBoxToRoute(
    route: RouteEntity,
  ): AsyncResult<RepositoryException, RouteEntity> {
    try {
      const routeData = RouteMapper.toModel(route);
      const result = await this.routeRepository.save(routeData);
      return right(RouteMapper.toEntity(result));
    } catch (error) {
      return left(new RepositoryException('Error add box from route'));
    }
  }
  async deleteRouteById(id: string): AsyncResult<RepositoryException, Unit> {
    try {
      const result = await this.routeRepository.delete(id);
      if (result.affected === 0) {
        return left(new RepositoryException('Route not found ' + id));
      }
      return right(unit);
    } catch (error) {
      return left(new RepositoryException('Error deleting route'));
    }
  }

  async save(
    route: RouteEntity,
  ): AsyncResult<RepositoryException, RouteEntity> {
    try {
      const routeData = RouteMapper.toModel(route);
      const routeModel = this.routeRepository.create(routeData);
      await this.routeRepository.save(routeModel);
      return right(RouteMapper.toEntity(routeModel));
    } catch (error) {
      return left(new RepositoryException('Error saving route'));
    }
  }
}
