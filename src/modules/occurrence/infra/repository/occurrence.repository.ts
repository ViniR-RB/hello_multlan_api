import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import { Repository } from 'typeorm';
import IOccurrenceRepository from '../../adapters/i_occurrence_repository';
import OccurrenceEntity from '../../domain/occurrence.entity';
import OccurrenceMapper from '../mapper/occurrence_mapper';
import OccurrenceModel from '../model/occurrence.model';

@Injectable()
export default class OccurrenceRepository implements IOccurrenceRepository {
  constructor(private readonly repository: Repository<OccurrenceModel>) {}

  async create(
    occurrence: OccurrenceEntity,
  ): Promise<Either<ServiceException, OccurrenceEntity>> {
    try {
      const model = OccurrenceMapper.toModel(occurrence);
      const savedModel = await this.repository.save(model);
      return right(OccurrenceMapper.toEntity(savedModel));
    } catch (error) {
      return left(new ServiceException('Error creating occurrence', 500));
    }
  }

  async findAll(): Promise<Either<ServiceException, OccurrenceEntity[]>> {
    try {
      const models = await this.repository.find();
      const entities = models.map(model => OccurrenceMapper.toEntity(model));
      return right(entities);
    } catch (error) {
      return left(new ServiceException('Error fetching occurrences', 500));
    }
  }

  async findById(
    id: string,
  ): Promise<Either<ServiceException, OccurrenceEntity | null>> {
    try {
      const model = await this.repository.findOne({ where: { id } });
      if (!model) {
        return right(null);
      }
      return right(OccurrenceMapper.toEntity(model));
    } catch (error) {
      return left(new ServiceException('Error fetching occurrence', 500));
    }
  }

  async update(
    id: string,
    occurrence: OccurrenceEntity,
  ): Promise<Either<ServiceException, OccurrenceEntity>> {
    try {
      const model = OccurrenceMapper.toModel(occurrence);
      await this.repository.update(id, model);
      return right(occurrence);
    } catch (error) {
      return left(new ServiceException('Error updating occurrence', 500));
    }
  }

  async findByBoxId(
    boxId: string,
  ): Promise<Either<ServiceException, OccurrenceEntity[]>> {
    try {
      const models = await this.repository.find({ where: { boxId } });
      const entities = models.map(model => OccurrenceMapper.toEntity(model));
      return right(entities);
    } catch (error) {
      return left(
        new ServiceException('Error fetching occurrences by box', 500),
      );
    }
  }
}
