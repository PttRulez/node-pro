import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { IGoodsController } from './goods.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { CreateGoodDto } from './dto/create-good.dto';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HTTPError } from '../errors/http-error.class';
import { GoodsService } from './goods.service';
import { UpdateGoodDto } from './dto/update-good.dto';
import { AdminGuard } from '../auth/admin.guard';

@injectable()
export class GoodsController extends BaseController implements IGoodsController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.GoodsService) private goodsService: GoodsService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/add-amount',
				method: 'post',
				func: this.addAmount,
			},
			{
				path: '/',
				method: 'post',
				func: this.create,
				middlewares: [new AdminGuard(), new ValidateMiddleware(CreateGoodDto)],
			},
			{
				path: '/:goodId',
				method: 'delete',
				func: this.delete,
				middlewares: [new AdminGuard()],
			},
			{
				path: '/',
				method: 'get',
				func: this.getList,
			},
			{
				path: '/',
				method: 'patch',
				func: this.update,
				middlewares: [new AdminGuard()],
			},
		]);
	}

	async addAmount(
		{ body }: Request<{}, {}, { amount: number; id: number }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.goodsService.addAmount(body.amount, body.id);

		if (!result) return next(new HTTPError(422, 'Нет такого товара'));

		this.ok(res, result);
	}

	async create(
		req: Request<{}, {}, CreateGoodDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const good = await this.goodsService.create(req.body);

		if (!good) return next(new HTTPError(422, 'Товар с таким названием существует'));

		this.ok(res, good);
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.goodsService.delete(parseInt(req.params.goodId));

		if (!result) return next(new HTTPError(422, 'Товара с таким айди не существует'));

		this.ok(res, true);
	}

	async getList(
		req: Request<{}, {}, {}, { limit?: number; offset?: number }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const params = {
			offset: req.query.offset,
			limit: req.query.limit,
		};
		const list = await this.goodsService.getList(params);
		this.ok(res, list);
	}

	async update(
		req: Request<{}, {}, UpdateGoodDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const updatedGood = await this.goodsService.update(req.body);

		if (!updatedGood) return next(new HTTPError(422, 'Товара с таким айди не существует'));

		this.ok(res, updatedGood);
	}
}
