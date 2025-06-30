import BoxModel from '@/modules/box/infra/model/box.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('route')
export default class RouteModel {
  @PrimaryColumn()
  id: string;

  @Column({})
  name: string;

  @OneToMany(() => BoxModel, box => box.route)
  boxes: BoxModel[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
