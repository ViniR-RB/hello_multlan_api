export default class SummaryBoxDto {
  constructor(
    private readonly totalBoxes: string,
    private readonly totalCustomers: string,
    private readonly zoneInfo: Record<string, number>[],
    private readonly totalRoutes: number,
  ) {
    this.totalBoxes = totalBoxes;
    this.totalCustomers = totalCustomers;
    this.zoneInfo = zoneInfo;
    this.totalRoutes = totalRoutes;
  }
  static fromJson({ summary, zone_info, total_routes }): SummaryBoxDto {
    const { total_boxes, total_customers } = summary[0];
    return new SummaryBoxDto(
      total_boxes,
      total_customers,
      zone_info,
      total_routes[0].total_routes,
    );
  }
}
