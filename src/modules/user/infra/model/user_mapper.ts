import UserEntity from '@/modules/user/domain/user.entity';
import UserModel from '@/modules/user/infra/model/user.model';

export default class UserMapper {
  static toEntity(userModel: UserModel): UserEntity {
    const { id, ...rest } = userModel;
    return new UserEntity({ ...rest }, id);
  }

  static toModel(userEntity: UserEntity) {
    return {
      id: userEntity.userId,
      name: userEntity.userName,
      email: userEntity.userEmail,
      password: userEntity.userPassword,
      role: userEntity.userRole,
      isActive: userEntity.userActive,
      createdAt: userEntity.userCreatedAt,
      updatedAt: userEntity.userUpdatedAt,
    };
  }
}
