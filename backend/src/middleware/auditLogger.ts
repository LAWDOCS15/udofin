import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog';

/**
 * Middleware to intercept write operations and log them to the database.
 * Tracks who (Admin/Superadmin), what (Action), and where (IP).
 */
export const auditLogger = (moduleName: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body: any) {
      // Only log successful modifications (POST, PATCH, DELETE, PUT)
      if (req.method !== 'GET' && res.statusCode >= 200 && res.statusCode < 300) {
        AuditLog.create({
          adminId: req.user?.id,
          adminRole: req.user?.role,
          nbfcId: req.user?.nbfcId || null,
          action: `${req.method} ${req.originalUrl}`,
          module: moduleName,
          details: req.body, // Log payload for accountability
          ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }).catch(err => console.error("Logging failed", err));
      }
      return originalJson.call(this, body);
    };
    next();
  };
};