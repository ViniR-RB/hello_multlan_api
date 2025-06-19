import { JwtSignPayload } from '@/core/interfaces/jwt.payload';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtSignPayload = request.user;

    const hasRole = requiredRoles.some(role => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role');
    }

    return true;
  }
}
