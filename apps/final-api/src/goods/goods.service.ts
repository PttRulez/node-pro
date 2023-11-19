import { inject, injectable } from 'inversify';
import { IGoodsService } from './goods.service.interface';
import { TYPES } from '../types';
import { CreateGoodDto } from './dto/create-good.dto';
import { GoodsRepository } from './goods.repository';
import { Good } from './good.entity';
import { UpdateGoodDto } from './dto/update-good.dto';
import { GoodErrors } from './errors';

@injectable()
export class GoodsService implements IGoodsService {
	constructor(@inject(TYPES.GoodsRepository) private goodsRepository: GoodsRepository) {}

	addAmount(amount: number, goodId: number): Promise<Good | null> {
		return this.goodsRepository.addAmount(amount, goodId);
	}

	async buy(goods: Record<string, number>): Promise<boolean> {
		const success = await this.goodsRepository.buy(goods);
		return success;
	}

	async create(dto: CreateGoodDto): Promise<Good | null> {
		const sameNameGood = await this.goodsRepository.findByName(dto.name);

		if (sameNameGood) return null;

		return this.goodsRepository.create(
			dto.amount,
			dto.description,
			dto.imageUrl,
			dto.name,
			dto.price,
		);
	}

	async delete(id: number): Promise<Good | boolean> {
		const result = await this.goodsRepository.delete(id);

		return result;
	}

	async getList(params?: {
		limit?: number;
		offset?: number;
	}): Promise<{ count: number; currentPage: number; goods: Good[]; totalPages: number }> {
		const offset = params?.offset ?? 0;
		const limit = params?.limit ?? 2;

		const res = await this.goodsRepository.getList({ offset, limit });
		const totalPages = Math.ceil(res.count / limit);

		return { ...res, currentPage: Math.ceil(offset / limit) + 1, totalPages };
	}

	async getListByIds(ids: Array<number>): Promise<Good[]> {
		const dbRes = await this.goodsRepository.getListByIds(ids);
		return dbRes;
	}

	update(dto: UpdateGoodDto): Promise<Good | null> {
		return this.goodsRepository.update(dto);
	}
}
