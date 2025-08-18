import UserDto from '@/modules/user/dto/user.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof UserDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserDto = request.user;

    return data ? user?.[data] : user;
  },
);
