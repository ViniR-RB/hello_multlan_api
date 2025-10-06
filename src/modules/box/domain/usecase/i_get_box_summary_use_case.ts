import UseCase from '@/core/interface/use_case';
import BoxSummaryReadModel from '@/modules/box/infra/read-models/box_summary_read_model';

export default interface IGetBoxSummaryUseCase
  extends UseCase<void, GetBoxSummaryResponse> {}

export class GetBoxSummaryResponse {
  constructor(public readonly boxSummaryReadModel: BoxSummaryReadModel) {}

  fromResponse() {
    return this.boxSummaryReadModel.toObject();
  }
}
