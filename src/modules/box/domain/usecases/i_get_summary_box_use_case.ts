import { IUseCase } from '@/core/interfaces/use_case';
import SummaryBoxReadModel from '@/modules/box/domain/read-models/summary_box_read_model';

export default interface IGetSummaryBoxUseCase
  extends IUseCase<void, GetSummaryBoxResponse> {}

export class GetSummaryBoxResponse {
  constructor(public readonly summaryBox: SummaryBoxReadModel) {}

  fromResponse() {
    return {
      ...this.summaryBox.toObject(),
    };
  }
}
