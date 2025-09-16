import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import IGetRoutersUseCase, {
  GetRoutersParam,
  GetRoutersResponse,
} from '@/modules/routers/domain/usecase/i_get_routers_use_case';

export default class GetRoutersService implements IGetRoutersUseCase {
  constructor(private readonly routerRepository: IRouterRepository) {}

  async execute(
    param: GetRoutersParam,
  ): AsyncResult<AppException, GetRoutersResponse> {
    const routers = await this.routerRepository.findMany(
      param.pageOptions,
      param.boxId,
      param.routerId,
    );
    if (routers.isLeft()) {
      return left(routers.value);
    }
    return right(new GetRoutersResponse(routers.value));
  }
}
