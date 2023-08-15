import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

class App {
	async init() {
		await prisma.$connect();
		await prisma.post
	}
}

const app = new App();
app.init();