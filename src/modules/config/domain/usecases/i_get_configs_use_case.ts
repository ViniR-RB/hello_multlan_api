import UseCase from '@/core/interface/use_case';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface IGetConfigsUseCase
  extends UseCase<GetConfigsParam, GetConfigsResponse> {}

export interface GetConfigsParam {
  pageOptions: PageOptionsEntity;
}

export class GetConfigsResponse {
  constructor(public readonly page: PageEntity<ConfigEntity>) {}

  fromResponse() {
    return this.page.toObject();
  }
}
