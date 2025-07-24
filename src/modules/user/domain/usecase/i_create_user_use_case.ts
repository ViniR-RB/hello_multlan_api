import { IUseCase } from '@/core/interfaces/use_case';
import CreateUserDto from '@/modules/user/dto/create_user.dto';
import UserDto from '@/modules/user/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import UserEntity from '../user.entity';
export class CreateUserParams {
  constructor(public readonly user: CreateUserDto) {}
}

export class CreateUserResponse {
  static fromEntity(user: UserEntity) {
    return plainToInstance(UserDto, {
      ...user.toObject(),
    });
  }
}
export default interface ICreateUserUseCase
  extends IUseCase<CreateUserParams, CreateUserResponse> {}
