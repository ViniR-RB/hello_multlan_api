import { BaseModelIdUuidCreated } from '@/core/models/base.models';
import Formmaters from '@/core/utils/formmaters';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'occurrence_types' })
export default class OccurrenceTypeModel extends BaseModelIdUuidCreated {
  @Column({
    unique: true,
    length: 50,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => Formmaters.capitalizeFirstLetter(value),
    },
  })
  name: string;
}
