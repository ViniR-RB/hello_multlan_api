import UseCase from '@/core/interface/use_case';
import { Unit } from '@/core/types/unit';

export default interface IDeleteConfigUseCase
  extends UseCase<DeleteConfigParam, DeleteConfigResponse> {}

export interface DeleteConfigParam {
  id: string;
}

export class DeleteConfigResponse {
  constructor(public readonly unit: Unit) {}

  fromResponse() {
    return { message: 'Config deleted successfully' };
  }
}
