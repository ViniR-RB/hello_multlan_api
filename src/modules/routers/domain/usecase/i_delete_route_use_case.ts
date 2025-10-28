import UseCase from '@/core/interface/use_case';

export default interface IDeleteRouteUseCase
  extends UseCase<DeleteRouteParam, DeleteRouteResponse> {}

export interface DeleteRouteParam {
  routeId: string;
}

export class DeleteRouteResponse {
  constructor() {}

  fromResponse() {
    return { message: 'Route deleted successfully' };
  }
}
