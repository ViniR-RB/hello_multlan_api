import { Either } from 'src/core/either/either';
import Nil from 'src/core/either/nil';
import ServiceException from 'src/core/erros/service.exception';
import UserEntity from '../user.entity';
export class CreateUserParams {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  toEntity() {
    return new UserEntity({
      name: this.name,
      email: this.email,
      password: this.password,
    });
  }
}
export default interface ICreateUserUseCase {
  call(user: CreateUserParams): Promise<Either<ServiceException, Nil>>;
}
