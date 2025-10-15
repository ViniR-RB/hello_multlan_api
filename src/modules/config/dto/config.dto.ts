export default class ConfigDto {
  id: string;
  key: string;
  value: string | number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ConfigDto>) {
    Object.assign(this, partial);
  }
}
