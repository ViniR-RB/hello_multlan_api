import UseCase from '@/core/interface/use_case';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';

export default interface IUpdateOccurrenceTypeUseCase
  extends UseCase<UpdateOccurrenceTypeParam, UpdateOccurrenceTypeResponse> {}

export interface UpdateOccurrenceTypeParam {
  id: string;
  name: string;
}

export class UpdateOccurrenceTypeResponse {
  constructor(public readonly occurrenceType: OccurrenceTypeEntity) {}

  fromResponse() {
    return this.occurrenceType.toObject();
  }
}
