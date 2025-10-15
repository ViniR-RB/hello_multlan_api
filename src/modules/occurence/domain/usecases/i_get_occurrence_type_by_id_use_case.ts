import UseCase from '@/core/interface/use_case';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';

export default interface IGetOccurrenceTypeByIdUseCase
  extends UseCase<GetOccurrenceTypeByIdParam, GetOccurrenceTypeByIdResponse> {}

export interface GetOccurrenceTypeByIdParam {
  id: string;
}

export class GetOccurrenceTypeByIdResponse {
  constructor(public readonly occurrenceType: OccurrenceTypeEntity) {}

  fromResponse() {
    return this.occurrenceType.toObject();
  }
}
