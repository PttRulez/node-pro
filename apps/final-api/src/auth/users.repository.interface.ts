import { User } from './user.entity';

export interface IUsersRepository {
	create: (name: string, email: string, password: string) => Promise<User>;
	find: (email: string) => Promise<User | null>;
}
