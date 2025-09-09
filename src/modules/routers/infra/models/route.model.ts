import { BaseModelIdUuidCreated } from '@/core/models/base.models';
import BoxModel from '@/modules/box/infra/models/box.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('routers')
export default class RouterModel extends BaseModelIdUuidCreated {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => BoxModel, box => box.route)
  boxs: BoxModel[];
}
