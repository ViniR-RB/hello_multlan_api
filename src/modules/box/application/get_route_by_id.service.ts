import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import IGetRouteByIdUseCase, {
  GetRouteByIdUseCaseParam,
  GetRouteByIdUseCaseResponse,
} from '@/modules/box/domain/usecases/i_get_route_by_id_use_case';

export default class GetRouteByIdService implements IGetRouteByIdUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(
    param: GetRouteByIdUseCaseParam,
  ): AsyncResult<ServiceException, GetRouteByIdUseCaseResponse> {
    const routeFinderByIdResult = await this.routeRepository.findById({
      relations: ['boxes'],
      routeId: param.id,
      select: ['id', 'boxes', 'createdAt', 'updatedAt'],
    });

    if (routeFinderByIdResult.isLeft()) {
      return left(
        new ServiceException(routeFinderByIdResult.value.message, 404),
      );
    }

    return right(
      GetRouteByIdUseCaseResponse.fromEntity(routeFinderByIdResult.value),
    );
  }
}
