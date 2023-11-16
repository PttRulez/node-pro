import { App } from 'src/app';
import { boot } from '../src/index';
import request from 'supertest';
import { PrismaService } from 'src/database/prisma.service';
import { TYPES } from 'src/types';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';

let application: App;
let prisma: PrismaService;

const userToCreate: AuthRegisterDto = {
	email: 'vladimir@mail.ru',
	password: '123',
	name: 'Vladimir',
};

const wrongUser = { email: 'vladimirwrong@wrong.ru', password: 'hhhadasd' };

beforeAll(async () => {
	const { app, appContainer } = await boot;
	prisma = appContainer.get<PrismaService>(TYPES.PrismaService);
	application = app;
	await prisma.cleanDb();
});

describe('Auth e2e', () => {
	it('Register - success', async () => {
		const res = await request(application.app).post('/auth/register').send(userToCreate);
		expect(res.statusCode).toBe(200);
	});

	it('Register without name - error', async () => {
		const res = await request(application.app)
			.post('/auth/register')
			.send({ email: 'aleks@mail.ru', password: '123' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app).post('/auth/login').send(userToCreate);
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app).post('/auth/login').send(wrongUser);
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app).post('/auth/login').send(userToCreate);

		const res = await request(application.app)
			.get('/auth/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe(userToCreate.email);
	});

	it('Info - error', async () => {
		const login = await request(application.app).post('/auth/login').send(wrongUser);

		const res = await request(application.app)
			.get('/auth/info')
			.set('Authorization', `Bearer sdasdsad`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(async () => {
	application.close();
});
