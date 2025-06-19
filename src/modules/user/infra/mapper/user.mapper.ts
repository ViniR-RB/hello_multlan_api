import UserEntity from '@/modules/user/domain/user.entity';
import UserModel from '@/modules/user/infra/model/user.model';

export default class UserMapper {
  static toEntity(userModel: UserModel): UserEntity {
    return new UserEntity(
      {
        name: userModel.name,
        email: userModel.email,
        password: userModel.password,
        createdAt: userModel.createdAt,
        updatedAt: userModel.updatedAt,
        role: userModel.role,
      },
      userModel.id,
    );
  }

  static toModel(userEntity: UserEntity) {
    return userEntity.toObject();
  }
}
