import BaseRepository from '@/core/interface/base_repository';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';
import RouterModel from '@/modules/routers/infra/models/route.model';

export default interface IRouterRepository
  extends BaseRepository<RouterModel, RouterEntity> {}
