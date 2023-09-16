import { inject, injectable } from 'inversify';
import { IAuthService } from './auth.service.interface';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from './user.entity';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { AuthRepository } from './auth.repository';
import { UserModel } from '@prisma/client';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.AuthRepository) private authRepository: AuthRepository,
	) {}

	async createUser({ email, name, password }: AuthRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existingUser = await this.authRepository.find(email);
		if (existingUser) {
			return null;
		}
		return this.authRepository.create(newUser);
	}

	async validateUser({ email, password }: AuthLoginDto): Promise<boolean> {
		const existingUser = await this.authRepository.find(email);
		if (!existingUser) {
			return false;
		}
		const newUser = new User(existingUser.email, existingUser.name, existingUser.password);
		return newUser.comparePassword(password, existingUser.password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.authRepository.find(email);
	}
}
