import RouteModel from '@/modules/box/infra/model/route.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import BoxEntity, { BoxZone } from '../../domain/box.entity';
@Entity('box')
export default class BoxModel {
  @PrimaryColumn()
  id: string;

  @Column()
  label: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column({ name: 'free_space' })
  freeSpace: number;

  @Column({ name: 'filled_space' })
  filledSpace: number;

  @Column({ name: 'signal', type: 'float' })
  signal: number;

  @Column({ name: 'image' })
  image: string;

  @Column({ name: 'list_users', type: 'simple-array' })
  listUser: string[];

  @Column({ name: 'zone', type: 'enum', enum: BoxZone })
  zone: BoxZone;

  @Column({ nullable: true, default: '' })
  note?: string;

  @Column({ name: 'route_id', nullable: true }) 
  routeId?: string;

  @ManyToOne(() => RouteModel, route => route.boxes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'route_id' })
  route?: RouteModel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  toEntity() {
    return new BoxEntity(
      {
        label: this.label,
        latitude: this.latitude,
        longitude: this.longitude,
        freeSpace: this.freeSpace,
        filledSpace: this.filledSpace,
        signal: this.signal,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        listUser: this.listUser,
        note: this.note,
        image: this.image,
        zone: this.zone,
        routeId: this.routeId
      },
      this.id,
    );
  }
}
