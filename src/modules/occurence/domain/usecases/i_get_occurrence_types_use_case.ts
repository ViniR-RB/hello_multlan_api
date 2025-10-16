import UseCase from '@/core/interface/use_case';
import OccurrenceTypeEntity from '@/modules/occurence/domain/entities/occurrence_type.entity';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';

export default interface IGetOccurrenceTypesUseCase
  extends UseCase<GetOccurrenceTypesParam, GetOccurrenceTypesResponse> {}

export interface GetOccurrenceTypesParam {
  pageOptions: PageOptionsEntity;
  name?: string;
}

export class GetOccurrenceTypesResponse {
  constructor(public readonly page: PageEntity<OccurrenceTypeEntity>) {}

  fromResponse() {
    return this.page.toObject();
  }
}
