import RouterModel from '@/modules/routers/infra/models/route.model';

export interface RouterQueryObjects {
  selectFields?: (keyof RouterModel)[];
  relations?: string[];
  routerId?: string;
}
