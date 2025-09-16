import UseCase from '@/core/interface/use_case';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';

export default interface ICancelOccurrenceUseCase
  extends UseCase<CancelOccurrenceParam, CancelOccurrenceResponse> {}

export interface CancelOccurrenceParam {
  userCancelingId: number;
  occurrenceId: string;
  reason: string;
}

export class CancelOccurrenceResponse {
  constructor(private readonly occurrence: OccurrenceEntity) {}

  fromResponse() {
    return this.occurrence.toObject();
  }
}
