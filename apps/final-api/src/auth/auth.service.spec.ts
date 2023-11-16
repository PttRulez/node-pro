import 'reflect-metadata';
import { IConfigService } from 'src/config/config.service.interface';
import { Container } from 'inversify';
import { IUsersRepository } from './users.repository.interface';
import { IAuthService } from './auth.service.interface';
import { TYPES } from '../types';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Role, UserModel } from '@prisma/client';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const AuthRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let authRepository: IUsersRepository;
let authService: IAuthService;

beforeAll(() => {
	container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(AuthRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	authRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	authService = container.get<IAuthService>(TYPES.AuthService);
});

let createdUser: User | null;
const userToCreate: AuthRegisterDto = {
	email: 'aleks@mail.ru',
	name: 'Aleksandr',
	password: '123',
};

const wrongLogin: AuthLoginDto = {
	email: 'vasya@mail.ru',
	password: '543',
};

describe('AuthService', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		authRepository.create = jest
			.fn()
			.mockImplementationOnce((name: string, email: string, password: string): Promise<User> => {
				return Promise.resolve(new User({ name, email, passwordHash: password, id: 1 }));
			});
		createdUser = await authService.createUser(userToCreate);
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual(userToCreate.password);
	});

	it('validateUser correct', async () => {
		authRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await authService.validateUser(userToCreate);
		expect(result).toBeTruthy();
	});

	it('validateUser wrong password', async () => {
		authRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const result = await authService.validateUser({
			email: userToCreate.email,
			password: wrongLogin.password,
		});
		expect(result).toBeFalsy();
	});

	it('validateUser wrong email', async () => {
		authRepository.find = jest.fn().mockReturnValueOnce(null);
		const result = await authService.validateUser({
			email: wrongLogin.email,
			password: userToCreate.password,
		});
		expect(result).toBeFalsy();
	});
});
