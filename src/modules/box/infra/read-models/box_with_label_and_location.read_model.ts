import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';

export default interface BoxWithLabelAndLocationReadModel {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  zone: BoxZone;
}
