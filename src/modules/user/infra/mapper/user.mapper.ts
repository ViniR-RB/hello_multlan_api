import UserEntity from '../../domain/user.entity';
import UserModel from '../model/user.model';

export default class UserMapper {
  static toEntity(model: UserModel): UserEntity {
    return new UserEntity(
      {
        name: model.name,
        email: model.email,
        password: model.password,
        role: model.role,
        isActive: model.isActive,
        firebaseId: model.firebaseId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
      },
      model.id,
    );
  }

  static toModel(entity: UserEntity): UserModel {
    const model = new UserModel();
    const data = entity.toObject();

    model.id = data.id;
    model.name = data.name;
    model.email = data.email;
    model.password = data.password;
    model.role = data.role;
    model.isActive = data.isActive;
    model.firebaseId = data.firebaseId;
    model.createdAt = data.createdAt;
    model.updatedAt = data.updatedAt;

    return model;
  }
}
