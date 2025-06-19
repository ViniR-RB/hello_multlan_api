import { USER_ROLE } from '@/modules/user/domain/user.entity';

export interface JwtSignPayload {
  sub: string;
  role: USER_ROLE;
  type: 'access' | 'refresh';
}
export interface JwtVerifyPayload {
  sub: string;
  iat: string;
  role: USER_ROLE;
  exp: string;
  type: string;
}
