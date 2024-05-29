import { Either } from 'src/core/either/either';
import ServiceException from 'src/core/erros/service.exception';
import TokenEntity from '../token.entity';

export class LoginParams {
  email: string;
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export default interface ILoginUseCase {
  call(
    loginParams: LoginParams,
  ): Promise<Either<ServiceException, TokenEntity>>;
}
