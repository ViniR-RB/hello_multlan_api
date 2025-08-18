import { BoxSummaryQueryResult } from '@/modules/box/adapters/i_box_repository';
import SummaryBoxReadModel from '@/modules/box/domain/read-models/summary_box_read_model';

export default class SummaryBoxReadModelMapper {
  static fromEntity(query: BoxSummaryQueryResult): SummaryBoxReadModel {
    return new SummaryBoxReadModel({
      totalBoxes: query.summary[0].total_boxes,
    });
  }
}
