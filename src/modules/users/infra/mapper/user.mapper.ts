import { BaseMapper } from '@/core/models/base.mapper';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserModel from '@/modules/users/infra/models/user.model';

export default abstract class UserMapper extends BaseMapper<
  UserEntity,
  UserModel
> {
  static toEntity(userModel: UserModel): UserEntity {
    return UserEntity.fromData({
      id: userModel.id,
      password: userModel.password,
      fcmToken: userModel.fcmToken,
      role: userModel.role,
      isActive: userModel.isActive,
      email: userModel.email,
      name: userModel.name,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt,
    });
  }

  static toModel(entity: UserEntity): Partial<UserModel> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      isActive: entity.isActive,
      password: entity.password,
      fcmToken: entity.fcmToken,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
