import { BaseModelIdUuidCreated } from '@/core/models/base.models';
import { BoxZone } from '@/modules/box/domain/entities/box_zone_enum';
import RouterModel from '@/modules/routers/infra/models/route.model';
import UserModel from '@/modules/users/infra/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('boxes')
export default class BoxModel extends BaseModelIdUuidCreated {
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column('decimal', {
    precision: 11,
    scale: 8,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => parseFloat(value),
    },
  })
  latitude: number;

  @Column('decimal', {
    precision: 11,
    scale: 8,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => parseFloat(value),
    },
  })
  longitude: number;

  @Column({ name: 'free_space', type: 'int' })
  freeSpace: number;

  @Column({ name: 'filled_space', type: 'int' })
  filledSpace: number;

  @Column({
    name: 'signal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => parseFloat(value),
    },
  })
  signal: number;

  @Column({ name: 'list_users', type: 'simple-array' })
  listUser: string[];
  @Column({ type: 'enum', enum: BoxZone })
  zone: BoxZone;

  @ManyToOne(() => RouterModel, route => route.boxs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'route_id' })
  route?: RouterModel;

  @Column({ name: 'route_id', type: 'uuid', nullable: true })
  routeId: string | null;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  note: string | null;

  @ManyToOne(() => UserModel, user => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: UserModel | null;

  @Column({ name: 'created_by_user_id', type: 'int', nullable: true })
  createdByUserId: number | null;

  @ManyToOne(() => UserModel, user => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedByUser: UserModel | null;

  @Column({ name: 'updated_by_user_id', type: 'int', nullable: true })
  updatedByUserId: number | null;
}
