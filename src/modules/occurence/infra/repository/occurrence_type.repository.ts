import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IOccurrenceTypeRepository from '@/modules/occurence/adapters/i_occurrence_type.repository';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';
import OccurrenceTypeRepositoryException from '@/modules/occurence/exceptions/occurrence_type_repository.exception';
import OccurrenceTypeMapper from '@/modules/occurence/infra/mapper/occurrence_type.mapper';
import OccurrenceTypeModel from '@/modules/occurence/infra/models/occurrence_type.model';
import { OccurrenceTypeQueryObject } from '@/modules/occurence/infra/query/query_object';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';

export default class OccurrenceTypeRepository
  implements IOccurrenceTypeRepository
{
  constructor(
    private readonly occurrenceTypeRepository: Repository<OccurrenceTypeModel>,
  ) {}
  async findOne(
    query: OccurrenceTypeQueryObject,
  ): AsyncResult<AppException, OccurrenceTypeEntity> {
    try {
      let options: FindOneOptions<OccurrenceTypeModel> = {
        select: query.selectFields,
        relations: query.relations,
      };
      if (query.occurrenceTypeId) {
        options.where = { id: query.occurrenceTypeId };
      }
      if (query.name) {
        options.where = { name: query.name.toLowerCase() };
      }
      return right(
        OccurrenceTypeMapper.toEntity(
          await this.occurrenceTypeRepository.findOneOrFail(options),
        ),
      );
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return left(
          new OccurrenceTypeRepositoryException(
            ErrorMessages.OCCURRENCE_TYPE_NOT_FOUND,
            404,
          ),
        );
      }
      return left(
        new OccurrenceTypeRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
  create(entity: OccurrenceTypeEntity): OccurrenceTypeModel {
    return this.occurrenceTypeRepository.create(
      OccurrenceTypeMapper.toModel(entity),
    );
  }

  async save(
    entity: OccurrenceTypeEntity,
  ): AsyncResult<AppException, OccurrenceTypeEntity> {
    try {
      const model = OccurrenceTypeMapper.toModel(entity);
      const saved = await this.occurrenceTypeRepository.save(model);
      return right(OccurrenceTypeMapper.toEntity(saved));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }

  async findById(id: string): AsyncResult<AppException, OccurrenceTypeEntity> {
    try {
      const model = await this.occurrenceTypeRepository.findOne({
        where: { id },
      });
      if (!model) {
        return left(OccurrenceTypeRepositoryException.notFound(id));
      }
      return right(OccurrenceTypeMapper.toEntity(model));
    } catch (error) {
      return left(
        new OccurrenceTypeRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findAll(
    pageOptions: PageOptionsEntity,
    name?: string,
  ): AsyncResult<AppException, PageEntity<OccurrenceTypeEntity>> {
    try {
      const queryBuilder =
        this.occurrenceTypeRepository.createQueryBuilder('occurrence_type');

      if (name) {
        queryBuilder.where('occurrence_type.name ILIKE :name', {
          name: `%${name}%`,
        });
      }

      queryBuilder
        .orderBy('occurrence_type.createdAt', pageOptions.order)
        .skip(pageOptions.skip)
        .take(pageOptions.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMeta = new PageMetaEntity({
        pageOptions,
        itemCount,
      });

      return right(
        new PageEntity(entities.map(OccurrenceTypeMapper.toEntity), pageMeta),
      );
    } catch (error) {
      return left(
        new OccurrenceTypeRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async delete(id: string): AsyncResult<AppException, Unit> {
    try {
      const result = await this.occurrenceTypeRepository.delete(id);
      if (result.affected === 0) {
        return left(OccurrenceTypeRepositoryException.notFound(id));
      }
      return right(unit);
    } catch (error) {
      return left(
        new OccurrenceTypeRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
