import type { Request, Response, NextFunction } from 'express';
import { type UserProfile } from '../services/dbService.js';
export interface AuthenticatedRequest extends Request {
    user?: UserProfile;
}
export declare const requireAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const requirePremium: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map