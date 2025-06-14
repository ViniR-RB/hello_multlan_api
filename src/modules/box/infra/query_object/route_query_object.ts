import RouteModel from '@/modules/box/infra/model/route.model';

export interface RouteQueryObject {
  routeId: string;
  select?: (keyof RouteModel)[];
  relations: string[];
}

export interface RouteQueryAllObject {
  select?: (keyof RouteModel)[];
  relations: string[];
}
