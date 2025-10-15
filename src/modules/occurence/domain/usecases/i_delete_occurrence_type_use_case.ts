import UseCase from '@/core/interface/use_case';
import { Unit } from '@/core/types/unit';

export default interface IDeleteOccurrenceTypeUseCase
  extends UseCase<DeleteOccurrenceTypeParam, DeleteOccurrenceTypeResponse> {}

export interface DeleteOccurrenceTypeParam {
  id: string;
}

export class DeleteOccurrenceTypeResponse {
  constructor(public readonly unit: Unit) {}

  fromResponse() {
    return { message: 'Occurrence type deleted successfully' };
  }
}
