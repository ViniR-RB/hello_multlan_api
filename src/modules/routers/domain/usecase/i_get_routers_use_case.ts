import UseCase from '@/core/interface/use_case';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';

export default interface IGetRoutersUseCase
  extends UseCase<GetRoutersParam, GetRoutersResponse> {}

export interface GetRoutersParam {
  pageOptions: PageOptionsEntity;
  boxId?: string;
  routerId?: string;
}

export class GetRoutersResponse {
  constructor(public readonly page: PageEntity<RouterEntity>) {}

  fromResponse() {
    return this.page.toObject();
  }
}
