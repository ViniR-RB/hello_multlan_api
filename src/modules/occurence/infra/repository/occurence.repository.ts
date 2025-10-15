import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceStatus from '@/modules/occurence/domain/entities/occurrence_status';
import OccurrenceRepositoryException from '@/modules/occurence/exceptions/occurrence_repository.exception';
import OccurenceMapper from '@/modules/occurence/infra/mapper/occurence.mapper';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import { OccurrenceQueryObject } from '@/modules/occurence/infra/query/query_object';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';

export default class OccurrenceRepository implements IOcurrenceRepository {
  constructor(
    private readonly occurenceRepository: Repository<OccurrenceModel>,
  ) {}
  async findMany(
    pageOptions: PageOptionsEntity,
    status?: OccurrenceStatus,
    boxId?: string,
    userId?: number,
    occurrenceTypeId?: string,
  ): AsyncResult<AppException, PageEntity<OccurrenceEntity>> {
    try {
      let queryBuilder =
        this.occurenceRepository.createQueryBuilder('occurrence');
      queryBuilder = queryBuilder.leftJoinAndSelect(
        'occurrence.users',
        'users',
      );

      if (status) {
        queryBuilder = queryBuilder.where('occurrence.status = :status', {
          status,
        });
      }
      if (boxId) {
        queryBuilder = queryBuilder.andWhere('occurrence.boxId = :boxId', {
          boxId,
        });
      }
      if (userId) {
        queryBuilder = queryBuilder.andWhere('users.id = :userId', {
          userId,
        });
      }
      if (occurrenceTypeId) {
        queryBuilder = queryBuilder.andWhere(
          'occurrence.occurrenceTypeId = :occurrenceTypeId',
          {
            occurrenceTypeId: occurrenceTypeId,
          },
        );
      }

      queryBuilder = queryBuilder
        .orderBy('occurrence.createdAt', pageOptions.order)
        .skip(pageOptions.skip)
        .take(pageOptions.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();
      const pageMeta = new PageMetaEntity({
        pageOptions,
        itemCount,
      });
      return right(
        new PageEntity(entities.map(OccurenceMapper.toEntity), pageMeta),
      );
    } catch (error) {
      return left(
        new OccurrenceRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
  async findOne(
    query: OccurrenceQueryObject,
  ): AsyncResult<AppException, OccurrenceEntity> {
    try {
      let options: FindOneOptions<OccurrenceModel> = {
        relations: query.relations,
        select: query.selectFields,
      };
      if (query.occurrenceId) {
        options = { ...options, where: { id: query.occurrenceId } };
      }
      return right(
        OccurenceMapper.toEntity(
          await this.occurenceRepository.findOneOrFail(options),
        ),
      );
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return left(
          new OccurrenceRepositoryException(
            ErrorMessages.OCCURRENCE_NOT_FOUND,
            404,
          ),
        );
      }
      return left(
        new OccurrenceRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          e,
        ),
      );
    }
  }
  create(entity: OccurrenceEntity): OccurrenceModel {
    return this.occurenceRepository.create(OccurenceMapper.toModel(entity));
  }
  async save(
    entity: OccurrenceEntity,
  ): AsyncResult<AppException, OccurrenceEntity> {
    try {
      const occurenceModel = this.create(entity);
      await this.occurenceRepository.save(occurenceModel);
      return right(OccurenceMapper.toEntity(occurenceModel));
    } catch (e) {
      return left(
        new OccurrenceRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          e,
        ),
      );
    }
  }
}
