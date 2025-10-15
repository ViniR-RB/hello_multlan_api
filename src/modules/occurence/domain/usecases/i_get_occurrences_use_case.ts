import UseCase from '@/core/interface/use_case';
import OccurrenceEntity from '@/modules/occurence/domain/entities/occurrence.entity';
import OccurrenceStatus from '@/modules/occurence/domain/entities/occurrence_status';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface IGetOccurrencesUseCase
  extends UseCase<GetOccurrencesParam, GetOccurrencesResponse> {}

export interface GetOccurrencesParam {
  pageOptions: PageOptionsEntity;
  status?: OccurrenceStatus;
  boxId?: string;
  userId?: number;
  occurrenceTypeId?: string;
}
export class GetOccurrencesResponse {
  constructor(public readonly page: PageEntity<OccurrenceEntity>) {}

  fromResponse() {
    return this.page.toObject();
  }
}
