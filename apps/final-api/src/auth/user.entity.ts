import { Role } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

export interface IUserConstructor {
	email: string;
	name: string;
	passwordHash?: string;
	id?: number;
	role?: Role;
}

export class User {
	private readonly _email: string;
	private readonly _name: string;
	private readonly _role: Role;
	private _id: number;
	private _password: string;

	constructor(user: IUserConstructor) {
		this._email = user.email;
		this._name = user.name;
		if (user.id) {
			this._id = user.id;
		}
		this._role = user.role ?? Role.MANAGER;
		if (user.passwordHash) {
			this._password = user.passwordHash;
		}
	}

	get id(): number {
		return this._id;
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	get role(): Role {
		return this._role;
	}

	async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	async comparePassword(pass: string, hash: string): Promise<boolean> {
		return compare(pass, this._password);
	}
}
