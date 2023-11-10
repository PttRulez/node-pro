import { inject, injectable } from 'inversify';
import { IGoodsRepository, IUpdateGood } from './goods.repository.interface';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { Good } from './good.entity';

@injectable()
export class GoodsRepository implements IGoodsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async addAmount(amount: number, goodId: number): Promise<Good | null> {
		try {
			const good = await this.prismaService.client.good.update({
				where: { id: goodId },
				data: { amount: { increment: amount } },
			});

			return new Good(good);
		} catch (e) {
			return null;
		}
	}

	async create(amount: number, name: string, price: number): Promise<Good> {
		const newGood = await this.prismaService.client.good.create({
			data: { amount, name, price },
		});

		return new Good(newGood);
	}

	async delete(goodId: number): Promise<boolean> {
		try {
			await this.prismaService.client.good.delete({ where: { id: goodId } });
			return true;
		} catch (e) {
			return false;
		}
	}

	async findByName(name: string): Promise<Good | null> {
		const goodFromBd = await this.prismaService.client.good.findUnique({
			where: { name },
		});

		if (!goodFromBd) return null;

		return new Good(goodFromBd);
	}

	async getList(): Promise<Good[]> {
		const dbres = await this.prismaService.client.good.findMany({});
		return dbres.map((i) => new Good(i));
	}

	async update(data: IUpdateGood): Promise<Good | null> {
		try {
			const updatedGood = await this.prismaService.client.good.update({
				where: { id: data.id },
				data,
			});
			return new Good(updatedGood);
		} catch (e) {
			return null;
		}
	}
}
