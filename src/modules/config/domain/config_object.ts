interface ConfigObjectProps {
  key: string;
  value: string | number;
}

export default class ConfigObject {
  private constructor(private readonly props: ConfigObjectProps) {
    this.props = {
      key: props.key,
      value: props.value,
    };
  }

  private static validate(props: ConfigObjectProps) {
    if (!props.key || props.key.trim().length === 0) {
      throw new Error('Config key cannot be empty');
    }
    if (props.key.trim().length < 2) {
      throw new Error('Config key must be at least 2 characters long');
    }
    if (props.key.trim().length > 100) {
      throw new Error('Config key must be at most 100 characters long');
    }
    if (props.value === null || props.value === undefined) {
      throw new Error('Config value cannot be null or undefined');
    }
    if (typeof props.value === 'string' && props.value.trim().length === 0) {
      throw new Error('Config value cannot be empty string');
    }
  }

  static create(props: ConfigObjectProps): ConfigObject {
    this.validate(props);
    return new ConfigObject({
      key: props.key.trim(),
      value: typeof props.value === 'string' ? props.value.trim() : props.value,
    });
  }

  static fromData(props: ConfigObjectProps): ConfigObject {
    return new ConfigObject(props);
  }

  get key(): string {
    return this.props.key;
  }

  get value(): string | number {
    return this.props.value;
  }

  equals(other: ConfigObject): boolean {
    if (!other) return false;
    return this.props.key === other.key && this.props.value === other.value;
  }

  toObject() {
    return {
      key: this.props.key,
      value: this.props.value,
    };
  }

  toString(): string {
    return `${this.props.key}: ${this.props.value}`;
  }
}
