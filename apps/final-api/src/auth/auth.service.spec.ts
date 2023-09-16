import 'reflect-metadata';
import { IConfigService } from '@/config/config.service.interface';
import { Container } from 'inversify';
import { IAuthRepository } from './auth.repository.interface';
import { IAuthService } from './auth.service.interface';
import { TYPES } from '../types';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const AuthRepositoryMock: IAuthRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let authRepository: IAuthRepository;
let authService: IAuthService;

beforeAll(() => {
	container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IAuthRepository>(TYPES.AuthRepository).toConstantValue(AuthRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	authRepository = container.get<IAuthRepository>(TYPES.AuthRepository);
	authService = container.get<IAuthService>(TYPES.AuthService);
});

let createdUser: UserModel | null;

describe('AuthService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		authRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await authService.createUser({
			email: 'aleks@mail.ru',
			name: 'Aleksandr',
			password: '123',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('123');
	});

	it('validateUser correct', async () => {
		authRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await authService.validateUser({
			email: 'aleks@mail.ru',
			password: '123',
		});
		expect(result).toBeTruthy();
	});

	it('validateUser wrong password', async () => {
		authRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await authService.validateUser({
			email: 'aleks@mail.ru',
			password: '1234',
		});
		expect(result).toBeFalsy();
	});

	it('validateUser wrong email', async () => {
		authRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await authService.validateUser({
			email: 'aleks2@mail.ru',
			password: '123',
		});
		expect(result).toBeFalsy();
	});
});
