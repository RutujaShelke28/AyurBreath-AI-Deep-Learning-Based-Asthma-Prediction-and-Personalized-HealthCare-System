import jwt from 'jsonwebtoken';
import { findUserById } from './models';

export async function authenticateRequest(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'No token provided' };
    }

    const token = authHeader.split(' ')[1];

    if (token === 'demo-local-token' && process.env.ALLOW_DEMO_LOGIN === 'true') {
      return { user: { id: 'demo_user' }, error: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ayurbreath-jwt-secret-change-in-production');

    try {
      const user = await findUserById(decoded.id);
      return { user: user || { id: decoded.id }, error: null };
    } catch {
      return { user: { id: decoded.id }, error: null };
    }
  } catch (err) {
    return { user: null, error: 'Invalid token' };
  }
}
