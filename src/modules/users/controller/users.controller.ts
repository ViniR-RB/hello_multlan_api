import { Roles } from '@/core/decorators/role.decorator';
import AuthGuard from '@/core/guard/auth.guard';
import PageOptionsEntity from '@/modules/pagination/domain/entities/page_options.entity';
import { PageOptionsDto } from '@/modules/pagination/dto/page_options.dto';
import UserRole from '@/modules/users/domain/entities/user_role';
import IFindUsersByFiltersUseCase from '@/modules/users/domain/usecase/i_find_users_by_filters_use_case';
import FindUsersQueryFiltersDto from '@/modules/users/dtos/find_users_query_filters.dto';
import { FIND_USERS_BY_FILTERS_SERVICE } from '@/modules/users/symbols';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';

@Controller('/api/users')
export default class UsersController {
  constructor(
    @Inject(FIND_USERS_BY_FILTERS_SERVICE)
    private readonly findUsersByFiltersService: IFindUsersByFiltersUseCase,
  ) {}

  @Get('/filters')
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  async findByFilters(
    @Query() options: PageOptionsDto,
    @Query() findUsersQueryFilters: FindUsersQueryFiltersDto,
  ) {
    const result = await this.findUsersByFiltersService.execute({
      options: new PageOptionsEntity(options.order, options.page, options.take),
      role: findUsersQueryFilters.role,
    });
    if (result.isLeft()) {
      const error = result.value;
      throw error;
    }
    return result.value.fromResponse();
  }
}
