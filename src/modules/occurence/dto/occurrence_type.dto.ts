export default class OccurrenceTypeDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<OccurrenceTypeDto>) {
    Object.assign(this, partial);
  }
}
