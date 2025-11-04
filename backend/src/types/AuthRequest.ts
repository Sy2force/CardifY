import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: { 
    _id: string; 
    isAdmin: boolean;
    isBusiness: boolean;
  };
  body: any;
  query: any;
  params: any;
}
