import { BaseModelIdUuidCreated } from '@/core/models/base.models';
import { Column, Entity } from 'typeorm';

@Entity('configs')
export default class ConfigModel extends BaseModelIdUuidCreated {
  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 500 })
  value: string;
}
