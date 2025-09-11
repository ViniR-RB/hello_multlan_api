import BaseRepository from '@/core/interface/base_repository';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';

export default interface IOcurrenceRepository
  extends BaseRepository<OccurrenceModel, OccurrenceEntity> {}
