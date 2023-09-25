import 'reflect-metadata';
import { IMiddleware } from '@/common/middleware.interface';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { inject } from 'inversify';
import { TYPES } from '@/types';

export class AuthMiddleware implements IMiddleware {
	constructor(
		private secret: string,
		private authRepository: AuthRepository,
	) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, async (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload !== 'string') {
					const user = await this.authRepository.find(payload.email);
					req.user = user;
					next();
				}
			});
		} else {
			next();
		}
	}
}
