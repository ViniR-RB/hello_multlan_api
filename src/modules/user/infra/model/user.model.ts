import UserEntity, { USER_ROLE } from '@/modules/user/domain/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export default class UserModel {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'role',
    default: USER_ROLE.INTERNAL,
    type: 'enum',
    enum: USER_ROLE,
  })
  role: USER_ROLE;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'firebase_id', nullable: true })
  firebaseId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  toEntity() {
    return new UserEntity(
      {
        name: this.name,
        email: this.email,
        password: this.password,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        role: this.role,
        firebaseId: this.firebaseId,
      },
      this.id,
    );
  }
}
