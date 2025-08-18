import { BoxZone } from '@/modules/box/domain/box.entity';

interface SummaryBoxReadModelProps {
  totalBoxes: string;
  totalCustomers: string;
  zoneInfo: Record<keyof BoxZone, number>[];
  totalRoutes: number;
}

export default class SummaryBoxReadModel {
  constructor(public readonly props: SummaryBoxReadModelProps) {
    this.props = props;
  }

  get totalBoxes(): string {
    return this.props.totalBoxes;
  }

  get totalCustomers(): string {
    return this.props.totalCustomers;
  }

  get zoneInfo(): Record<keyof BoxZone, number>[] {
    return this.props.zoneInfo;
  }

  get totalRoutes(): number {
    return this.props.totalRoutes;
  }

  toObject() {
    return {
      totalBoxes: this.totalBoxes,
      totalCustomers: this.totalCustomers,
      zoneInfo: this.zoneInfo,
      totalRoutes: this.totalRoutes,
    };
  }
}
