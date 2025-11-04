import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isBusiness: boolean;
    role: string;
  };
  body: any;
  params: any;
  query: any;
}
