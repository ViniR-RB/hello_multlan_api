import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IRouterRepository from '@/modules/routers/adapters/i_router.repository';
import IFindAllRoutesUseCase, {
  FindAllRoutesResponse,
} from '@/modules/routers/domain/usecase/i_find_all_routes_use_case';

export default class FindAllRoutesService implements IFindAllRoutesUseCase {
  constructor(private readonly routeRepository: IRouterRepository) {}
  async execute(param: void): AsyncResult<AppException, FindAllRoutesResponse> {
    const routesFindAll = await this.routeRepository.findAll();
    if (routesFindAll.isLeft()) {
      return left(routesFindAll.value);
    }
    return right(new FindAllRoutesResponse(routesFindAll.value));
  }
}
