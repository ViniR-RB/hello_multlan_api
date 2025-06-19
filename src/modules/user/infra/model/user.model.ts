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
    default: USER_ROLE.INTERNO,
    type: 'enum',
    enum: USER_ROLE,
  })
  role: USER_ROLE;

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
      },
      this.id,
    );
  }
}
