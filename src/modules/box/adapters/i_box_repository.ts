import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base_repository';
import AsyncResult from '@/core/types/async_result';
import { Unit } from '@/core/types/unit';
import BoxEntity from '@/modules/box/domain/entities/box.entity';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import BoxModel from '@/modules/box/infra/models/box.model';
import { BoxQueryObject } from '@/modules/box/infra/query/query_object';
import BoxSummaryReadModel from '@/modules/box/infra/read-models/box_summary_read_model';
import BoxWithLabelAndLocationReadModel from '@/modules/box/infra/read-models/box_with_label_and_location.read_model';

export default interface IBoxRepository
  extends BaseRepository<BoxModel, BoxEntity> {
  findOne(query: BoxQueryObject): AsyncResult<AppException, BoxEntity>;
  findBoxesWithLabelAndLocationByLatLongMinMaxAndFilters(
    latMin: number,
    latMax: number,
    longMin: number,
    longMax: number,
    zone?: BoxZone,
  ): AsyncResult<AppException, BoxWithLabelAndLocationReadModel[]>;
  findBoxesByIds(ids: string[]): AsyncResult<AppException, BoxEntity[]>;
  deleteById(id: string): AsyncResult<AppException, Unit>;
  getSummary(): AsyncResult<AppException, BoxSummaryReadModel>;
}
