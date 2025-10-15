import UseCase from '@/core/interface/use_case';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';

export default interface IGetConfigByIdUseCase
  extends UseCase<GetConfigByIdParam, GetConfigByIdResponse> {}

export interface GetConfigByIdParam {
  id: string;
}

export class GetConfigByIdResponse {
  constructor(public readonly config: ConfigEntity) {}

  fromResponse() {
    return this.config.toObject();
  }
}
