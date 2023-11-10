import { Request, Response, NextFunction } from 'express';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';

export interface IGoodsController {
	addAmount: (
		req: Request<{}, {}, { amount: number; id: number }>,
		res: Response,
		next: NextFunction,
	) => void;
	create: (req: Request<{}, {}, CreateGoodDto>, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
	getList: (req: Request, res: Response, next: NextFunction) => void;
	update: (req: Request<{}, {}, UpdateGoodDto>, res: Response, next: NextFunction) => void;
}
