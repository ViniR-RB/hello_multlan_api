import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import BoxRepositoryException from '@/modules/box/exceptions/box_repository.exception';
import BoxMapper from '@/modules/box/infra/mapper/box.mapper';
import BoxModel from '@/modules/box/infra/models/box.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export default class BoxRepository implements IBoxRepository {
  constructor(
    @InjectRepository(BoxModel)
    private readonly boxRepository: Repository<BoxModel>,
  ) {}
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
