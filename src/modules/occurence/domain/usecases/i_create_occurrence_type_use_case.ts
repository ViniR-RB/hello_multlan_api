import UseCase from '@/core/interface/use_case';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';

export default interface ICreateOccurrenceTypeUseCase
  extends UseCase<CreateOccurrenceTypeParam, CreateOccurrenceTypeResponse> {}

export interface CreateOccurrenceTypeParam {
  name: string;
}

export class CreateOccurrenceTypeResponse {
  constructor(public readonly occurrenceType: OccurrenceTypeEntity) {}

  fromResponse() {
    return this.occurrenceType.toObject();
  }
}
