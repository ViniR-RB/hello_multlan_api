import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IOcurrenceRepository from '@/modules/occurence/adapters/i_ocurrence.repository';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceRepositoryException from '@/modules/occurence/exceptions/occurrence_repository.exception';
import OccurenceMapper from '@/modules/occurence/infra/mapper/occurence.mapper';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import { OccurrenceQueryObject } from '@/modules/occurence/infra/query/query_object';
import { EntityNotFoundError, FindOneOptions, Repository } from 'typeorm';

export default class OccurrenceRepository implements IOcurrenceRepository {
  constructor(
    private readonly occurenceRepository: Repository<OccurrenceModel>,
  ) {}
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
