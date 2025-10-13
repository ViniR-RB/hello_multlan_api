import UseCase from '@/core/interface/use_case';
import PageEntity from '@/modules/pagination/domain/entities/page.entity';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import UserEntity from '@/modules/users/domain/entities/user.entity';
import UserRole from '@/modules/users/domain/entities/user_role';

export default interface IFindUsersByFiltersUseCase
  extends UseCase<FindUsersByFiltersParam, FindUsersByFiltersResponse> {}

export interface FindUsersByFiltersParam {
  options: PageOptionsEntity;
  email?: string;
  role?: UserRole;
}

export class FindUsersByFiltersResponse {
  constructor(private readonly pageEntity: PageEntity<UserEntity>) {}

  fromResponse() {
    return {
      ...this.pageEntity.toObject(),
    };
  }
}
