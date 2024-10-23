import { randomUUID } from 'crypto';

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt?: Partial<Date>;
  updatedAt?: Partial<Date>;
}

export default class UserEntity {
  constructor(
    private readonly props: UserProps,
    private readonly id?: string,
  ) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
    this.id = id || randomUUID();
  }

  get userId(): string {
    return this.id;
  }
  get userEmail(): string {
    return this.props.email;
  }
  get userName(): string {
    return this.props.name;
  }
  get userPassword(): string {
    return this.props.password;
  }
  get userCreatedAt() {
    return this.props.createdAt;
  }
  get userUpdatedAt() {
    return this.props.updatedAt;
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword;
  }
}
