import { Either } from '@/core/either/either';
import ServiceException from '@/core/erros/service.exception';
import UserEntity from '@/modules/user/domain/user.entity';

export default interface IShowMyUserUseCase {
  call(
    showMyUserParam: ShowMyUserParam,
  ): Promise<Either<ServiceException, ShowMyUserResponse>>;
}

export class ShowMyUserParam {
  constructor(public userId: string) {
    this.userId = userId;
  }
}
export class ShowMyUserResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  static fromEntity(user: UserEntity): ShowMyUserResponse {
    return new ShowMyUserResponse(user.userId, user.userName, user.userEmail);
  }
}
