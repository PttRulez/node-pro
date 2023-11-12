import { Request, Response, NextFunction } from 'express';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

export interface IAuthController {
	login: (req: Request<{}, {}, AuthLoginDto>, res: Response, next: NextFunction) => void;
	register: (req: Request<{}, {}, AuthRegisterDto>, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
}
