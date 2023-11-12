import { inject, injectable } from 'inversify';
import { IGoodsService } from './goods.service.interface';
import { TYPES } from '../types';
import { CreateGoodDto } from './dto/create-good.dto';
import { GoodsRepository } from './goods.repository';
import { Good } from './good.entity';
import { UpdateGoodDto } from './dto/update-good.dto';

@injectable()
export class GoodsService implements IGoodsService {
	constructor(@inject(TYPES.GoodsRepository) private goodsRepository: GoodsRepository) {}

	addAmount(amount: number, goodId: number): Promise<Good | null> {
		return this.goodsRepository.addAmount(amount, goodId);
	}

	async create(dto: CreateGoodDto): Promise<Good | null> {
		const sameNameGood = await this.goodsRepository.findByName(dto.name);

		if (sameNameGood) return null;

		return this.goodsRepository.create(dto.amount, dto.name, dto.price);
	}

	async delete(id: number): Promise<boolean> {
		const result = await this.goodsRepository.delete(id);

		return result;
	}

	getList(params?: { limit?: number; offset?: number }): Promise<Good[]> {
		return this.goodsRepository.getList(params);
	}

	update(dto: UpdateGoodDto): Promise<Good | null> {
		return this.goodsRepository.update(dto);
	}
}
