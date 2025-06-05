import { JwtUser } from './jwt-user';

declare module 'express' {
  interface Request {
    user?: JwtUser;
  }
}
