export default class OccurrenceDto {
  id: string;
  title: string;
  description: string;
  status: string;
  boxId: string;
  createdByUserId: string;
  receivedByUserId?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
