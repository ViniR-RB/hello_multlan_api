import UseCase from '@/core/interface/use_case';
import RouterEntity from '@/modules/routers/domain/entities/route.entity';

export default interface IFindAllRoutesUseCase
  extends UseCase<void, FindAllRoutesResponse> {}

export class FindAllRoutesResponse {
  constructor(public readonly routes: RouterEntity[]) {}

  fromResponse() {
    return this.routes.map(route => route.toObject());
  }
}
