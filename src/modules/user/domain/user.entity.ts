import UserDomainException from '@/modules/user/exceptions/user_domain.exception';
import { randomUUID } from 'crypto';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  INTERNAL = 'INTERNAL',
}

interface UserProps {
  name: string;
  email: string;
  password: string;
  role?: USER_ROLE;
  isActive?: boolean;
  firebaseId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class UserEntity {
  constructor(
    private readonly props: UserProps,
    private readonly id?: string,
  ) {
    this.props = {
      ...props,
      role: props.role || USER_ROLE.INTERNAL,
      isActive: props.isActive ?? true,
      firebaseId: props.firebaseId || null,
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
  get userRole(): USER_ROLE {
    return this.props.role;
  }

  get userActive(): boolean {
    return this.props.isActive!;
  }

  get userFirebaseId(): string | null {
    return this.props.firebaseId;
  }

  updatePassword(newPassword: string) {
    this.props.password = newPassword;
  }

  updateFirebaseId(firebaseId: string) {
    this.props.firebaseId = firebaseId;
    this.touch();
  }

  toObject() {
    return {
      id: this.id,
      ...this.props,
    };
  }

  updateUserInformation(
    data: Partial<
      Omit<UserProps, 'id' | 'createdAt' | 'updatedAt' | 'password'>
    >,
  ) {
    if (data.name && data.name.length <= 3) {
      throw new UserDomainException('name must be at least 3 characters long');
    }
    this.props.name = data.name;
    if (data.email && !data.email.includes('@')) {
      throw new UserDomainException('email must be a valid email address');
    }
    if (data.role && !Object.values(USER_ROLE).includes(data.role)) {
      throw new UserDomainException('role must be a valid');
    }
    this.props.role = data.role;

    this.props.email = data.email;
    this.touch();
  }

  toggleUser() {
    this.props.isActive = !this.props.isActive;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
