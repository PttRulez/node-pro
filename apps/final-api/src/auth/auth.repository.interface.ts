import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface IAuthRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
