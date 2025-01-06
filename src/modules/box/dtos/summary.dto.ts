export default class SummaryBoxDto {
  constructor(
    private readonly totalBoxes: string,
    private readonly totalCustomers: string,
    private readonly zoneInfo: Record<string, number>[],
  ) {
    this.totalBoxes = totalBoxes;
    this.totalCustomers = totalCustomers;
  }
  static fromJson({ summary, zone_info }): SummaryBoxDto {
    const { total_boxes, total_customers } = summary[0];

    return new SummaryBoxDto(total_boxes, total_customers, zone_info);
  }
}
// {
//   summary: [ { total_boxes: 5, total_customers: 18 } ],
//   zone_info: [
//     { zone: 'MODERATE', zone_count: 1 },
//     { zone: 'SAFE', zone_count: 4 }
//   ]
// }
