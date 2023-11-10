import { IUsersRepository } from './users.repository.interface';
import { User } from '../auth/user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(name: string, email: string, password: string): Promise<User> {
		const userFromBd = await this.prismaService.client.userModel.create({
			data: { email, password, name },
		});
		return new User({ ...userFromBd, passwordHash: userFromBd.password });
	}

	async find(email: string): Promise<User | null> {
		const userFromBd = await this.prismaService.client.userModel.findFirst({ where: { email } });
		if (!userFromBd) return null;

		return new User({ ...userFromBd, passwordHash: userFromBd.password });
	}
}
