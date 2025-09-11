import { BaseModelIdUuidCreated } from '@/core/models/base.models';
import BoxModel from '@/modules/box/infra/models/box.model';
import UserModel from '@/modules/users/infra/models/user.model';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity('occurrences')
export default class OccurrenceModel extends BaseModelIdUuidCreated {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ManyToOne(() => BoxModel, {
    cascade: true,
  })
  @JoinColumn({ name: 'box_id' })
  box: BoxModel;
  @Column({ name: 'box_id', nullable: true })
  boxId: string | null;

  @ManyToMany(() => UserModel)
  @JoinTable({
    name: 'occurrence_users',
    joinColumn: {
      name: 'occurrence_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: UserModel[];
}
