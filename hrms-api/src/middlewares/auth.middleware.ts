import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-hrms-key';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (roleName: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.roles) {
        return res.status(403).json({ error: 'Forbidden: No roles found' });
      }

      if (!req.user.roles.includes(roleName)) {
        return res.status(403).json({ error: `Forbidden: Requires ${roleName} role` });
      }

      next();
    } catch (error) {
      return res.status(403).json({ error: 'Forbidden: Role validation failed' });
    }
  };
};
