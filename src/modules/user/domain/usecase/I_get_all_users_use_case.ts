import ServiceException from '@/core/erros/service.exception';
import { AsyncResult } from '@/core/types/async_result';
import UserEntity from '../user.entity';

export default interface IGetAllUsersUseCase {
  call(): AsyncResult<ServiceException, Array<GetAllUsersResponse>>;
}
export class GetAllUsersResponse {
  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly createdAt: Partial<Date>,
    private readonly updatedAt: Partial<Date>,
  ) {
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromUserEntity(user: UserEntity) {
    return new GetAllUsersResponse(
      user.userName,
      user.userEmail,
      user.userCreatedAt,
      user.userUpdatedAt,
    );
  }
}
