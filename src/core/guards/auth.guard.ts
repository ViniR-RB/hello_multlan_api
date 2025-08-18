import { JwtVerifyPayload } from '@/core/interfaces/jwt.payload';
import JsonWebTokenService from '@/core/services/json_web_token.service';
import IExtractUserFromJwt, {
  ExtractUserFromJwtParam,
} from '@/modules/auth/domain/usecase/i_extract_user_fow_jwt';
import { EXTRACT_USER_FROM_JWT } from '@/modules/auth/symbols';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JsonWebTokenService,
    @Inject(EXTRACT_USER_FROM_JWT)
    private readonly extractUseForJwtService: IExtractUserFromJwt,
  ) {}

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
      const user = await this.verifyUser(payload);
      request['user'] = user;
    } catch (e) {
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
      const user = await this.verifyUser(payload);

      request['user'] = user;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }
  private async verifyUser(payload: JwtVerifyPayload) {
    const param = new ExtractUserFromJwtParam(payload);
    const user = await this.extractUseForJwtService.call(param);
    if (user.isLeft()) {
      throw new UnauthorizedException(user.value.message);
    }
    return user.value;
  }
}
