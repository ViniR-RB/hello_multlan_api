export interface JwtSignPayload {
  sub: string;
  type: string;
}
export interface JwtVerifyPayload {
  sub: string;
  iat: string;
  exp: string;
  type: string;
}
