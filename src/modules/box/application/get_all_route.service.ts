import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import IGetAllRoutedUseCase, {
  GetRoutesUseCaseResponse,
} from '@/modules/box/domain/usecases/i_get_all_route_use_case';

export default class GetAllRouteService implements IGetAllRoutedUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(): AsyncResult<ServiceException, GetRoutesUseCaseResponse> {
    const routeList = await this.routeRepository.findAll({
      relations: ['boxes'],
    });
    if (routeList.isLeft()) {
      return left(new ServiceException(routeList.value.message, 400));
    }
    return right(
      routeList.value.map(route => GetRoutesUseCaseResponse.fromEntity(route)),
    );
  }
}
