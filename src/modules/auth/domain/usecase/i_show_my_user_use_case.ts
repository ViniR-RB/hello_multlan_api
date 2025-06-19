import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import UserEntity from '@/modules/user/domain/user.entity';

export default interface IShowMyUserUseCase {
  call(
    showMyUserParam: ShowMyUserParam,
  ): AsyncResult<ServiceException, ShowMyUserResponse>;
}

export class ShowMyUserParam {
  constructor(public userId: string) {
    this.userId = userId;
  }
}
export class ShowMyUserResponse {
  static fromEntity(user: UserEntity): ShowMyUserResponse {
    const {
      userCreatedAt,
      userEmail,
      userId,
      userName,
      userRole,
      userUpdatedAt,
    } = user;
    return {
      id: userId,
      name: userName,
      email: userEmail,
      role: userRole,
      createdAt: userCreatedAt,
      updatedAt: userUpdatedAt,
    };
  }
}
