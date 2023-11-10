import { CreateGoodDto } from './dto/create-good.dto';
import { Good } from './good.entity';
import { UpdateGoodDto } from './dto/update-good.dto';
import { HTTPError } from '@/errors/http-error.class';

export interface IGoodsService {
	addAmount: (amount: number, goodId: number) => Promise<Good | null>;
	create: (dto: CreateGoodDto) => Promise<Good | null>;
	delete: (id: number) => Promise<boolean>;
	getList: () => Promise<Good[]>;
	update: (dto: UpdateGoodDto) => Promise<Good | null>;
}
