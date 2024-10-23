import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserEntity from '../../domain/user.entity';

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
      },
      this.id,
    );
  }
}
