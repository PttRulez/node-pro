import { App } from '@/app';
import { boot } from '../src/index';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Auth e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/auth/register')
			.send({ email: 'aleks@mail.ru', password: '123' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/auth/login')
			.send({ email: 'petya@mail.ru', password: '123' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/auth/login')
			.send({ email: 'petya@mail.ru', password: 'wrongpassword' });
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/auth/login')
			.send({ email: 'petya@mail.ru', password: '123' });

		const res = await request(application.app)
			.get('/auth/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('petya@mail.ru');
	});

	it('Info - error', async () => {
		const login = await request(application.app)
			.post('/auth/login')
			.send({ email: 'petya@mail.ru', password: '123' });

		const res = await request(application.app)
			.get('/auth/info')
			.set('Authorization', `Bearer wrongjwt`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
