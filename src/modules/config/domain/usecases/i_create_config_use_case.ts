import UseCase from '@/core/interface/use_case';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';

export default interface ICreateConfigUseCase
  extends UseCase<CreateConfigParam, CreateConfigResponse> {}

export interface CreateConfigParam {
  key: string;
  value: string | number;
}

export class CreateConfigResponse {
  constructor(public readonly config: ConfigEntity) {}

  fromResponse() {
    return this.config.toObject();
  }
}
