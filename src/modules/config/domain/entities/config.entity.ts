import ConfigObject from '@/modules/config/domain/config_object';
import { randomUUID } from 'crypto';

export interface ConfigEntityProps {
  id: string;
  config: ConfigObject;
  createdAt: Date;
  updatedAt: Date;
}

export default class ConfigEntity {
  constructor(private readonly props: ConfigEntityProps) {}

  static create(key: string, value: string | number, id?: string) {
    return new ConfigEntity({
      id: id || randomUUID().toString(),
      config: ConfigObject.create({
        key: key,
        value: value,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromData(props: ConfigEntityProps) {
    return new ConfigEntity(props);
  }

  updateValue(value: string | number) {
    this.props.config = ConfigObject.create({
      key: this.props.config.key,
      value: value,
    });
    this.toTouch();
  }

  private toTouch() {
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }
  get config() {
    return this.props.config;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  toObject() {
    return {
      id: this.id,
      key: this.config.key,
      value: this.config.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
