import { inject, injectable } from 'inversify';
import { IAuthService } from './auth.service.interface';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from './user.entity';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UsersRepository } from './users.repository';
import { Role } from '@prisma/client';

@injectable()
export class AuthService implements IAuthService {
	private salt: number = Number(this.configService.get('SALT'));

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private authRepository: UsersRepository,
	) {}

	async createUser({ name, email, password }: AuthRegisterDto): Promise<User | null> {
		const existingUser = await this.authRepository.find(email);
		if (existingUser) {
			return null;
		}

		const model = new User({ email, name, role: Role.MANAGER });
		await model.setPassword(password, this.salt);

		return this.authRepository.create(name, email, model.password);
	}

	async validateUser({ email, password }: AuthLoginDto): Promise<boolean> {
		const existingUser = await this.authRepository.find(email);
		if (!existingUser) {
			return false;
		}
		return existingUser.comparePassword(password, existingUser.password);
	}

	async getUserInfo(email: string): Promise<User | null> {
		return this.authRepository.find(email);
	}
}
