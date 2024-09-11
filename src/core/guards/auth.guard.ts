import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import JsonWebTokenService from '../services/json_web_token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JsonWebTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.route.path === '/api/auth/refresh') {
      return this.verifyRefreshToken(request);
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verify(token);
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Token is not an access token', {});
      }
      request['user'] = payload;
    } catch (e) {
      console.error('Authentication error:', e);
      throw new UnauthorizedException('Jwt Is invalid');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyRefreshToken(request: Request): Promise<boolean> {
    const { refreshToken } = request.body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const payload = await this.jwtService.verify(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token is not a refresh token');
      }
      request['user'] = payload;
    } catch (e) {
      console.error('Refresh token verification failed:', e);
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }
}
