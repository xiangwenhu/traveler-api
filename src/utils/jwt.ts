import process from 'node:process';
import JWT from 'jsonwebtoken';
import { BackendError } from './errors';

const JWT_CONFIG: JWT.SignOptions = {
  expiresIn: '24h',
};

const { JWT_SECRET } = process.env;

export default function generateToken(account: string): string {
  return JWT.sign({ account }, JWT_SECRET as string, JWT_CONFIG);
}

export function verifyToken(token: string) {
  try {
    const data = JWT.verify(token, JWT_SECRET as string);

    return data as { account: string };
  }
  catch (err) {
    if (err instanceof JWT.TokenExpiredError) {
      throw new BackendError('UNAUTHORIZED', {
        message: 'Token expired',
      });
    }

    throw new BackendError('UNAUTHORIZED', {
      message: 'Invalid token',
    });
  }
}
