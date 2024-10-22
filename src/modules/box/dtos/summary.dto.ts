export default class SummaryBoxDto {
  constructor(
    private readonly totalBoxes: string,
    private readonly totalCustomers: string,
  ) {
    this.totalBoxes = totalBoxes;
    this.totalCustomers = totalCustomers;
  }
  static fromJson({ total_boxes, total_customers }): SummaryBoxDto {
    return new SummaryBoxDto(total_boxes, total_customers);
  }
}
