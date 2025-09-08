import BoxModel from '@/modules/box/infra/models/box.model';

export interface BoxQueryObject {
  selectFields?: (keyof BoxModel)[];

  relations?: string[];
  boxId?: string;
}
