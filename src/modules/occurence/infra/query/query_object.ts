import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';

export interface OccurrenceQueryObject {
  selectFields?: (keyof OccurrenceModel)[];
  relations?: string[];
  occurrenceId?: string;
}
