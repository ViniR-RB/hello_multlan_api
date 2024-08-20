import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtSignPayload, JwtVerifyPayload } from '../interfaces/jwt.payload';
import ConfigurationService from './configuration.service';

@Injectable()
export default class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async sign(payload: JwtSignPayload) {
    if (payload.type === 'access') {
      return this.jwtService.sign(payload);
    }
    return this.jwtService.sign(payload, { expiresIn: '15d' });
  }

  async verify(token: string): Promise<JwtVerifyPayload> {
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      iat: string;
      exp: string;
      type: string;
    }>(token, {
      secret: this.configurationService.get('JWT_SECRET'),
    });
    return payload;
  }
}
