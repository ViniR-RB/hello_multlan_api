import OccurrenceModel from '@/modules/occurence/infra/models/occurrence.model';
import OccurrenceTypeModel from '@/modules/occurence/infra/models/occurrence_type.model';

export interface OccurrenceQueryObject {
  selectFields?: (keyof OccurrenceModel)[];
  relations?: string[];
  occurrenceId?: string;
}
export interface OccurrenceTypeQueryObject {
  selectFields?: (keyof OccurrenceTypeModel)[];
  relations?: string[];
  occurrenceTypeId?: string;
  name?: string;
}
