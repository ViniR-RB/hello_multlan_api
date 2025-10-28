import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import BoxRepositoryException from '@/modules/box/exceptions/box_repository.exception';
import BoxMapper from '@/modules/box/infra/mapper/box.mapper';
import BoxModel from '@/modules/box/infra/models/box.model';
import { BoxQueryObject } from '@/modules/box/infra/query/query_object';
import BoxSummaryReadModel from '@/modules/box/infra/read-models/box_summary_read_model';
import BoxWithLabelAndLocationReadModel from '@/modules/box/infra/read-models/box_with_label_and_location.read_model';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityNotFoundError,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';

export default class BoxRepository implements IBoxRepository {
  constructor(
    @InjectRepository(BoxModel)
    private readonly boxRepository: Repository<BoxModel>,
    private readonly dataSource: DataSource,
  ) {}
  async deleteById(id: string): AsyncResult<AppException, Unit> {
    try {
      const result = await this.boxRepository.delete(id);
      if (result.affected && result.affected > 0) {
        return right(unit);
      }
      return left(new BoxRepositoryException(ErrorMessages.BOX_NOT_FOUND, 404));
    } catch (error) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
  async findBoxesWithLabelAndLocationByLatLongMinMaxAndFilters(
    latMin: number,
    latMax: number,
    longMin: number,
    longMax: number,
    zone?: BoxZone,
  ): AsyncResult<AppException, BoxWithLabelAndLocationReadModel[]> {
    try {
      const queryBuilder = this.boxRepository
        .createQueryBuilder('box')
        .select(['box.id', 'box.label', 'box.latitude', 'box.longitude'])
        .where('box.latitude BETWEEN :latMin AND :latMax', { latMin, latMax })
        .andWhere('box.longitude BETWEEN :longMin AND :longMax', {
          longMin,
          longMax,
        });
      if (zone) {
        queryBuilder.andWhere('box.zone = :zone', { zone });
      }

      const boxes = await queryBuilder.getMany();

      return right(boxes.map(BoxMapper.toBoxWithLabelAndLocationReadModel));
    } catch (e) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }

  async getSummary(): AsyncResult<AppException, BoxSummaryReadModel> {
    try {
      const boxesByZoneQuery = await this.boxRepository
        .createQueryBuilder('box')
        .select('box.zone', 'zone')
        .addSelect('COUNT(box.id)', 'count')
        .groupBy('box.zone')
        .getRawMany();

      const totalBoxes = await this.boxRepository
        .createQueryBuilder('box')
        .getCount();

      // Contar total de rotas
      const totalRoutesResult = await this.dataSource.query(
        'SELECT COUNT(*) as count FROM routers',
      );
      const totalRoutes = parseInt(totalRoutesResult[0].count, 10);

      const boxesWithUsersQuery = await this.boxRepository
        .createQueryBuilder('box')
        .select('box.list_users', 'listUsers')
        .where('box.list_users IS NOT NULL')
        .andWhere("box.list_users != ''")
        .getRawMany();

      const allUsers = new Set<string>();
      boxesWithUsersQuery.forEach(box => {
        if (box.listUsers) {
          const users = box.listUsers
            .split(',')
            .filter(user => user.trim() !== '');
          users.forEach(user => allUsers.add(user.trim()));
        }
      });

      const totalClients = allUsers.size;

      const boxesByZones: Record<BoxZone, number> = {
        [BoxZone.SAFE]: 0,
        [BoxZone.MODERATE]: 0,
        [BoxZone.DANGER]: 0,
      };

      boxesByZoneQuery.forEach(result => {
        const zone = result.zone as BoxZone;
        const count = parseInt(result.count, 10);
        if (zone in boxesByZones) {
          boxesByZones[zone] = count;
        }
      });

      const summaryReadModel = new BoxSummaryReadModel({
        boxesByZones,
        totalRoutes,
        totalBoxes,
        totalClients,
      });

      return right(summaryReadModel);
    } catch (error) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
  async findBoxesByIds(ids: string[]): AsyncResult<AppException, BoxEntity[]> {
    const boxesModel = await this.boxRepository.find({
      where: { id: In(ids) },
    });
    return right(boxesModel.map(BoxMapper.toEntity));
  }

  async findBoxesByRouteId(
    routeId: string,
  ): AsyncResult<AppException, BoxWithLabelAndLocationReadModel[]> {
    try {
      const boxes = await this.boxRepository
        .createQueryBuilder('box')
        .select(['box.id', 'box.label', 'box.latitude', 'box.longitude'])
        .where('box.route_id = :routeId', { routeId })
        .getMany();

      return right(boxes.map(BoxMapper.toBoxWithLabelAndLocationReadModel));
    } catch (e) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }

  async findBoxesWithoutRouteId(): AsyncResult<
    AppException,
    BoxWithLabelAndLocationReadModel[]
  > {
    try {
      const boxes = await this.boxRepository
        .createQueryBuilder('box')
        .select(['box.id', 'box.label', 'box.latitude', 'box.longitude'])
        .where('box.route_id IS NULL')
        .getMany();

      return right(boxes.map(BoxMapper.toBoxWithLabelAndLocationReadModel));
    } catch (e) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }
  async findOne(query: BoxQueryObject): AsyncResult<AppException, BoxEntity> {
    try {
      let findOneOptions: FindOneOptions<BoxModel> = {
        select: query.selectFields,
        relations: query.relations,
      };
      if (query.boxId) {
        findOneOptions = {
          ...findOneOptions,
          where: { id: query.boxId },
        };
      }
      return right(
        BoxMapper.toEntity(
          await this.boxRepository.findOneOrFail(findOneOptions),
        ),
      );
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return left(
          new BoxRepositoryException(ErrorMessages.BOX_NOT_FOUND, 404),
        );
      }
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }

  async findAll(): AsyncResult<AppException, BoxEntity[]> {
    try {
      const boxes = await this.boxRepository.find();
      return right(boxes.map(box => BoxMapper.toEntity(box)));
    } catch (e) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, e),
      );
    }
  }
  create(entity: BoxEntity): BoxModel {
    const boxData = this.boxRepository.create(BoxMapper.toModel(entity));
    return this.boxRepository.create(boxData);
  }
  async save(entity: BoxEntity): AsyncResult<AppException, BoxEntity> {
    try {
      const boxModel = this.create(entity);
      await this.boxRepository.save(boxModel);
      return right(BoxMapper.toEntity(boxModel));
    } catch (error) {
      return left(
        new BoxRepositoryException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }
}
