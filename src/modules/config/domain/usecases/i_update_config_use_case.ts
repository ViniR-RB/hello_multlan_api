import UseCase from '@/core/interface/use_case';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';

export default interface IUpdateConfigUseCase
  extends UseCase<UpdateConfigParam, UpdateConfigResponse> {}

export interface UpdateConfigParam {
  id: string;
  value: string | number;
}

export class UpdateConfigResponse {
  constructor(public readonly config: ConfigEntity) {}

  fromResponse() {
    return this.config.toObject();
  }
}
