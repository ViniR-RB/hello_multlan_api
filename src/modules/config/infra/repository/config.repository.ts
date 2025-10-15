import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ServiceException from '@/core/exceptions/service.exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import { unit, Unit } from '@/core/types/unit';
import IConfigRepository from '@/modules/config/adapters/i_config_repository';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';
import ConfigRepositoryException from '@/modules/config/exceptions/config_repository.exception';
import ConfigMapper from '@/modules/config/infra/mapper/config.mapper';
import ConfigModel from '@/modules/config/infra/models/config.model';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageMetaEntity from '@/modules/pagination/domain/entities/page_meta.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { Repository } from 'typeorm';

export default class ConfigRepository implements IConfigRepository {
  constructor(private readonly configRepository: Repository<ConfigModel>) {}

  create(entity: ConfigEntity): ConfigModel {
    return this.configRepository.create(ConfigMapper.toModel(entity));
  }

  async save(entity: ConfigEntity): AsyncResult<AppException, ConfigEntity> {
    try {
      const model = ConfigMapper.toModel(entity);
      const saved = await this.configRepository.save(model);
      return right(ConfigMapper.toEntity(saved));
    } catch (error) {
      return left(
        new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error),
      );
    }
  }

  async findById(id: string): AsyncResult<AppException, ConfigEntity> {
    try {
      const model = await this.configRepository.findOne({
        where: { id },
      });
      if (!model) {
        return left(ConfigRepositoryException.notFound(id));
      }
      return right(ConfigMapper.toEntity(model));
    } catch (error) {
      return left(
        new ConfigRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findByKey(key: string): AsyncResult<AppException, ConfigEntity> {
    try {
      const model = await this.configRepository.findOne({
        where: { key },
      });
      if (!model) {
        return left(
          new ConfigRepositoryException(
            `Config with key ${key} not found`,
            404,
          ),
        );
      }
      return right(ConfigMapper.toEntity(model));
    } catch (error) {
      return left(
        new ConfigRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async findAll(
    pageOptions: PageOptionsEntity,
  ): AsyncResult<AppException, PageEntity<ConfigEntity>> {
    try {
      const queryBuilder = this.configRepository.createQueryBuilder('config');

      queryBuilder
        .orderBy('config.createdAt', pageOptions.order)
        .skip(pageOptions.skip)
        .take(pageOptions.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMeta = new PageMetaEntity({
        pageOptions,
        itemCount,
      });

      return right(
        new PageEntity(entities.map(ConfigMapper.toEntity), pageMeta),
      );
    } catch (error) {
      return left(
        new ConfigRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }

  async delete(id: string): AsyncResult<AppException, Unit> {
    try {
      const result = await this.configRepository.delete(id);
      if (result.affected === 0) {
        return left(ConfigRepositoryException.notFound(id));
      }
      return right(unit);
    } catch (error) {
      return left(
        new ConfigRepositoryException(
          ErrorMessages.UNEXPECTED_ERROR,
          500,
          error,
        ),
      );
    }
  }
}
