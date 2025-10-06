import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';

interface BoxSummaryReadModelProps {
  boxesByZones: Record<BoxZone, number>;
  totalRoutes: number;
  totalBoxes: number;
  totalClients: number;
}

export default class BoxSummaryReadModel {
  constructor(private readonly props: BoxSummaryReadModelProps) {
    this.props = {
      boxesByZones: props.boxesByZones,
      totalRoutes: props.totalRoutes,
      totalBoxes: props.totalBoxes,
      totalClients: props.totalClients,
    };
  }

  get boxesByZones(): Record<BoxZone, number> {
    return this.props.boxesByZones;
  }

  get totalRoutes(): number {
    return this.props.totalRoutes;
  }

  get totalBoxes(): number {
    return this.props.totalBoxes;
  }

  get totalClients(): number {
    return this.props.totalClients;
  }

  toObject() {
    return {
      boxesByZones: this.boxesByZones,
      totalRoutes: this.totalRoutes,
      totalBoxes: this.totalBoxes,
      totalClients: this.totalClients,
    };
  }
}
