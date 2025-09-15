import EmailValidator from '@/core/validators/email.validator';
import NameValidator from '@/core/validators/name.validator';
import PasswordValidator from '@/core/validators/password.validator';
import UserRole from '@/modules/users/domain/entities/user_role';
import UserDomainException from '@/modules/users/exceptions/user_domain_exception';

interface UserEntityProps {
  id?: number;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  fcmToken: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class UserEntity {
  private constructor(private readonly props: UserEntityProps) {
    this.props = {
      id: props.id,
      email: props.email,
      name: props.name,
      isActive: props.isActive ?? true,
      role: props.role,
      fcmToken: props.fcmToken,
      password: props.password,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  private static validade(props: Partial<UserEntityProps>) {
    if (props.email !== undefined && !EmailValidator.validate(props.email)) {
      throw new UserDomainException('Invalid email');
    }
    if (props.name !== undefined && !NameValidator.validate(props.name)) {
      throw new UserDomainException('Invalid name');
    }
    if (
      props.password !== undefined &&
      !PasswordValidator.validate(props.password)
    ) {
      throw new UserDomainException('Invalid password');
    }
    if (UserRole[props.role as keyof typeof UserRole] === undefined) {
      throw new UserDomainException('Invalid role');
    }
  }

  static create(props: UserEntityProps) {
    this.validade(props);
    return new UserEntity(props);
  }

  static fromData(props: UserEntityProps) {
    return new UserEntity(props);
  }

  changePassword(newPasswordHash: string) {
    this.props.password = newPasswordHash;
  }

  get id() {
    if (this.props.id === undefined) {
      return 0;
    }
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email!;
  }
  get role() {
    return this.props.role;
  }

  get fcmToken() {
    return this.props.fcmToken;
  }
  get isActive() {
    return this.props.isActive!;
  }

  get password() {
    return this.props.password;
  }
  get createdAt() {
    return this.props.createdAt!;
  }
  get updatedAt() {
    return this.props.updatedAt!;
  }

  userHasLogin() {
    if (this.isActive === false) {
      throw new UserDomainException('user is inactive');
    }
  }

  toObject() {
    return {
      id: this.props.id,
      email: this.props.email,
      name: this.props.name,
      isActive: this.props.isActive,
      fcmToken: this.props.fcmToken,
      role: this.props.role,
      password: this.props.password,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  toogleUser() {
    this.props.isActive = !this.props.isActive;
    this.toTouch();
  }

  updateUser(
    props: Partial<
      Omit<
        UserEntityProps,
        'id' | 'createdAt' | 'updatedAt' | 'password' | 'role' | 'isActive'
      >
    >,
  ) {
    const cleanProps = Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined),
    ) as Partial<UserEntityProps>;

    if (props.email !== undefined && !EmailValidator.validate(props.email)) {
      throw new UserDomainException('Invalid email');
    }
    if (props.name !== undefined && !NameValidator.validate(props.name)) {
      throw new UserDomainException('Invalid name');
    }
    if (props.fcmToken !== undefined && props.fcmToken === '') {
      throw new UserDomainException('Invalid fcmToken');
    }
    Object.assign(this.props, cleanProps);
    this.toTouch();
  }
  private toTouch() {
    this.props.updatedAt = new Date();
  }
}
