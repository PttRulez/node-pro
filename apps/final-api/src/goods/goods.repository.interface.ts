import { Good } from './good.entity';

export interface IUpdateGood {
	amount?: number;
	id: number;
	name?: string;
	price?: number;
}

export interface IGoodsRepository {
	addAmount(amount: number, goodId: number): Promise<Good | null>;
	create: (
		amount: number,
		description: string,
		imageUrl: string,
		name: string,
		price: number,
	) => Promise<Good | null>;
	delete: (id: number) => Promise<Good | boolean>;
	findByName: (name: string) => Promise<Good | null>;
	getList: (params: { limit: number; offset: number }) => Promise<{ goods: Good[]; count: number }>;
	update: (data: IUpdateGood) => Promise<Good | null>;
}
