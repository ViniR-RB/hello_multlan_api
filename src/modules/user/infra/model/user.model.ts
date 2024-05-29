import { Column, Entity, PrimaryColumn } from 'typeorm';
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

  toEntity() {
    return new UserEntity(
      {
        name: this.name,
        email: this.email,
        password: this.password,
      },
      this.id,
    );
  }
}
