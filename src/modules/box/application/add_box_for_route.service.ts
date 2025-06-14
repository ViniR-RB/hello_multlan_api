import { left, right } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import IBoxRepository from '@/modules/box/adapters/i_box_repository';
import IRouteRepository from '@/modules/box/adapters/i_route_repository';
import IAddBoxForRouteUseCase, {
  AddBoxForParam,
  AddBoxResponse,
} from '@/modules/box/domain/usecases/i_add_box_for_route_use_case';

export default class AddBoxForRouteService implements IAddBoxForRouteUseCase {
  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly boxRepository: IBoxRepository,
  ) {}

  async execute(
    param: AddBoxForParam,
  ): AsyncResult<ServiceException, AddBoxResponse> {
    try {
      const routeFinderResult = await this.routeRepository.findById({
        routeId: param.routeId,
        relations: ['boxes'],
      });

      if (routeFinderResult.isLeft()) {
        return left(new ServiceException('Rota não encontrada.', 404));
      }

      const boxFinderResultList = await this.boxRepository.findByIds([
        param.boxId,
      ]);

      if (boxFinderResultList.isLeft()) {
        return left(new ServiceException('Caixa não encontrada.', 404));
      }
      if (boxFinderResultList.value.length === 0) {
        return left(new ServiceException('Caixa não encontrada.', 404));
      }
      boxFinderResultList.value.map(box => {
        routeFinderResult.value.addBox(box);
      });

      await this.routeRepository.addBoxToRoute(routeFinderResult.value);

      return right(new AddBoxResponse());
    } catch (error) {
      if (error instanceof Error) {
        return left(new ServiceException(error.message, 400));
      }
    }
  }
}
