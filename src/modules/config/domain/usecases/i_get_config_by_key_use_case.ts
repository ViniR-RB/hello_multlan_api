import UseCase from '@/core/interface/use_case';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';

export default interface IGetConfigByKeyUseCase
  extends UseCase<GetConfigByKeyParam, GetConfigByKeyResponse> {}

export interface GetConfigByKeyParam {
  key: string;
}

export class GetConfigByKeyResponse {
  constructor(public readonly config: ConfigEntity) {}

  fromResponse() {
    return this.config.toObject();
  }
}
