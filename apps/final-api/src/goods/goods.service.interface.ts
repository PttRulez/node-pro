import { CreateGoodDto } from './dto/create-good.dto';
import { Good } from './good.entity';
import { UpdateGoodDto } from './dto/update-good.dto';

export interface IGoodsService {
	addAmount: (amount: number, goodId: number) => Promise<Good | null>;
	buy: (goods: Record<string, number>) => Promise<boolean>;
	create: (dto: CreateGoodDto) => Promise<Good | null>;
	delete: (id: number) => Promise<Good | boolean>;
	getList: (params?: {
		limit?: number;
		offset?: number;
	}) => Promise<{ count: number; currentPage: number; goods: Good[]; totalPages: number }>;
	getListByIds: (ids: Array<number>) => Promise<Good[]>;
	update: (dto: UpdateGoodDto) => Promise<Good | null>;
}
