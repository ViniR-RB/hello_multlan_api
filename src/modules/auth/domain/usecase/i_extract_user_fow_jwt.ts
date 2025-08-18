import { JwtVerifyPayload } from '@/core/interfaces/jwt.payload';
import { IUseCase } from '@/core/interfaces/use_case';
import UserEntity from '@/modules/user/domain/user.entity';
import UserResponseDto from '@/modules/user/dto/user_response.dto';
import { plainToClass } from 'class-transformer';

export default interface IExtractUserFromJwt
  extends IUseCase<ExtractUserFromJwtParam, ExtractUserFromJwtResponse> {}

export class ExtractUserFromJwtParam {
  constructor(public readonly payload: JwtVerifyPayload) {}
}

export class ExtractUserFromJwtResponse {
  static fromEntity(userEntity: UserEntity) {
    const userObject = userEntity.toObject();
    return plainToClass(UserResponseDto, userObject);
  }
}
