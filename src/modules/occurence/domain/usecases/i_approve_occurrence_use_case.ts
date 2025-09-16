import UseCase from '@/core/interface/use_case';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';

export default interface IApproveOccurrenceUseCase
  extends UseCase<ApproveOccurrenceParam, ApproveOccurrenceResponse> {}

export interface ApproveOccurrenceParam {
  userApprovingId: number;
  occurrenceId: string;
}

export class ApproveOccurrenceResponse {
  constructor(public readonly occurrence: OccurrenceEntity) {}

  fromResponse() {
    return this.occurrence.toObject();
  }
}
