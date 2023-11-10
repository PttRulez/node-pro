import { Good } from './good.entity';

export interface IUpdateGood {
	amount?: number;
	id: number;
	name?: string;
	price?: number;
}

export interface IGoodsRepository {
	addAmount(amount: number, goodId: number): Promise<Good | null>;
	create: (amount: number, name: string, price: number) => Promise<Good | null>;
	delete: (id: number) => Promise<boolean>;
	findByName: (name: string) => Promise<Good | null>;
	getList: () => Promise<Good[]>;
	update: (data: IUpdateGood) => Promise<Good | null>;
}
