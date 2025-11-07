import request from 'supertest';
import app from '../../server';
import { logger } from '../../services/logger';

const credentials = {
  admin: {
    email: 'admin@cardify.com',
    password: 'admin123'
  },
  business: {
    email: 'sarah@example.com', 
    password: 'business123'
  },
  user: {
    email: 'john@example.com',
    password: 'user123'
  }
};

export async function loginAs(role: 'admin' | 'business' | 'user'): Promise<string> {
  const res = await request(app)
    .post('/api/users/login')
    .send(credentials[role]);

  if (res.status !== 200) {
    logger.error(`Login failed for ${role}`, { status: res.status, body: res.body });
    throw new Error(`Failed to login as ${role}: ${res.status} - ${res.body.message || 'Unknown error'}`);
  }

  return res.body.token;
}

// Backward compatibility
export const loginAsAdmin = (): Promise<string> => loginAs('admin');
export const loginAsBusinessUser = (): Promise<string> => loginAs('business');
export const loginAsRegularUser = (): Promise<string> => loginAs('user');
