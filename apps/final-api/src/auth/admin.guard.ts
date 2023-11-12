import { IMiddleware } from '@/common/middleware.interface';
import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export class AdminGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user?.role === Role.ADMIN) {
			return next();
		}
		res.status(403).send({ error: 'Закрыто' });
	}
}
