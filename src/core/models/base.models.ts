import {
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export abstract class BaseModelIdNumericGenerated extends BaseModel {
  @PrimaryGeneratedColumn('increment')
  id: number;
}

export abstract class BaseModelIdUuidCreated extends BaseModel {
  @PrimaryColumn('uuid')
  id: string;
}
