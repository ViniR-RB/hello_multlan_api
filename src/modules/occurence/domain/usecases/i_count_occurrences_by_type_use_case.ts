import UseCase from '@/core/interface/use_case';

export default interface ICountOccurrencesByTypeUseCase
  extends UseCase<
    CountOccurrencesByTypeParam,
    CountOccurrencesByTypeResponse
  > {}

export interface CountOccurrencesByTypeParam {
  occurrenceTypeId: string;
  startDate: Date;
  endDate: Date;
  boxId?: string;
}

export class CountOccurrencesByTypeResponse {
  constructor(
    public readonly count: number,
    public readonly boxId?: string,
  ) {}

  fromResponse() {
    return {
      count: this.count,
      boxId: this.boxId,
    };
  }
}
