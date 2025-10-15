import { BaseMapper } from '@/core/models/base.mapper';
import ConfigObject from '@/modules/config/domain/config_object';
import ConfigEntity from '@/modules/config/domain/entities/config.entity';
import ConfigModel from '@/modules/config/infra/models/config.model';

export default abstract class ConfigMapper extends BaseMapper<
  ConfigEntity,
  ConfigModel
> {
  static toEntity(model: ConfigModel): ConfigEntity {
    const value = !isNaN(Number(model.value))
      ? Number(model.value)
      : model.value;

    return ConfigEntity.fromData({
      id: model.id,
      config: ConfigObject.fromData({
        key: model.key,
        value: value,
      }),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(entity: ConfigEntity): Partial<ConfigModel> {
    return {
      id: entity.id,
      key: entity.config.key,
      value: String(entity.config.value),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
