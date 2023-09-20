import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface IAuthRepository {
	create: (name: string, email: string, password: string) => Promise<User>;
	find: (email: string) => Promise<User | null>;
}
