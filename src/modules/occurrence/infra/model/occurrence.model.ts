import UserModel from '@/modules/user/infra/model/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OccurrenceStatus } from '../../domain/occurrence.entity';

@Entity('occurrences')
export default class OccurrenceModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: OccurrenceStatus,
    default: OccurrenceStatus.CREATED,
  })
  status: OccurrenceStatus;

  @Column()
  boxId: string;

  @ManyToOne(() => UserModel, {
    nullable: true,
  })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: UserModel | null;

  @Column({ name: 'created_by_user_id' })
  createdByUserId: string;

  @ManyToOne(() => UserModel, {
    nullable: true,
  })
  @JoinColumn({ name: 'received_by_user_id' })
  receivedByUser: UserModel | null;

  @Column({ name: 'received_by_user_id', nullable: true })
  receivedByUserId?: string | null;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
