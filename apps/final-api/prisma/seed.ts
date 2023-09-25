import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main(): Promise<void> {
	const sasha = await prisma.userModel.create({
		data: {
			email: 'sasha@mail.ru',
			name: 'Aleksandr Petrov',
			password: '123',
			role: 'ADMIN',
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
