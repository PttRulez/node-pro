import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(): Promise<void> {
	const sasha = await prisma.userModel.create({
		data: {
			email: 'sasha@mail.ru',
			name: 'Aleksandr Petrov',
			password: '12345',
			role: 'ADMIN',
		},
	});

	await prisma.good.createMany({
		data: [
			{
				amount: 2,
				description: 'Топовые фишки',
				imageUrl: 'https://mass-sport.ru/catalog/fischer/20322_1564915101.jpeg',
				name: 'Лыжи Fischer SPEEDMAX',
				price: 58500,
			},
			{
				amount: 5,
				description: 'Это карбонлайты !',
				imageUrl:
					'https://cdn.sportmaster.ru/upload/resize_cache/iblock/9a4/1500_2000_1/53602990299.jpg',
				name: 'Лыжи Fischer Carbonlite',
				price: 49499,
			},
			{
				amount: 10,
				description: 'Оптимальные фишера',
				imageUrl: 'https://mass-sport.ru/catalog/fischer/20322_1564915101.jpeg',
				name: 'Лыжи Fischer RCS',
				price: 55000,
			},
			{
				amount: 1,
				description: 'Топовые саломоны',
				imageUrl:
					'https://cdn.sportmaster.ru/upload/resize_cache/iblock/614/1500_2000_1/74491700299.jpg',
				name: 'Лыжи Salomon S/Lab Carbon',
				price: 86000,
			},
			{
				amount: 6,
				description: 'Вторые сверху саломоны',
				imageUrl:
					'https://mountainpeaks.ru/upload/iblock/3a6/kf53ni3lr1nltztz3ipwom9qmevmu0gm/74c72449_1642_11ec_96f5_002590ad6739_7ae30c67_1642_11ec_96f5_002590ad6739.jpg',
				name: 'Лыжи Salomon S/Race',
				price: 38421,
			},
			{
				amount: 14,
				description: 'Оптимальные salomon лыжи',
				imageUrl:
					'https://mountainpeaks.ru/upload/iblock/bd5/u45tv2lquctymbyb5fzjqwkpe8kwfcfc/e7282354_1642_11ec_96f5_002590ad6739_e7282359_1642_11ec_96f5_002590ad6739.jpg',
				name: 'Лыжи Salomon S/Max',
				price: 28674,
			},
		],
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
