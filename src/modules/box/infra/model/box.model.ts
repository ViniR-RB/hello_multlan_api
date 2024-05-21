import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import BoxEntity from '../../domain/box.entity';
@Entity('box')
export default class BoxModel {
  @PrimaryColumn()
  id: string;
  @Column({ type: 'decimal' })
  latitude: number;
  @Column({ type: 'decimal' })
  longitude: number;
  @Column({ name: 'free_space' })
  freeSpace: number;
  @Column({ name: 'filled_space' })
  filledSpace: number;
  @Column({ name: 'list_users', type: 'simple-array' })
  listUser: Array<string>;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  toEntity() {
    return new BoxEntity(
      {
        latitude: this.latitude,
        longitude: this.longitude,
        freeSpace: this.freeSpace,
        filledSpace: this.filledSpace,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        listUser: this.listUser,
      },
      this.id,
    );
  }
}
