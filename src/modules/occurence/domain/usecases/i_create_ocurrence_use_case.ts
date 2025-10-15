import UseCase from '@/core/interface/use_case';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';

export default interface ICreateOcurrenceUseCase
  extends UseCase<CreateOcurrenceParam, CreateOcurrenceResponse> {}

export interface CreateOcurrenceParam {
  title: string;
  description: string | null;
  usersId: number[];
  occurrenceTypeId: string;
  boxId: string | null;
}

export class CreateOcurrenceResponse {
  constructor(
    public readonly occurenceEntity: OccurrenceEntity,
    public readonly missingUsers: number[],
  ) {}

  fromResponse() {
    return {
      occurence: this.occurenceEntity.toObject(),
      missingUsers: this.missingUsers,
    };
  }
}
