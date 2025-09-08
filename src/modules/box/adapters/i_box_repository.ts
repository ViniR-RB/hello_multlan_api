import BaseRepository from '@/core/interface/base_repository';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import BoxModel from '@/modules/box/infra/models/box.model';

export default interface IBoxRepository
  extends BaseRepository<BoxModel, BoxEntity> {}
