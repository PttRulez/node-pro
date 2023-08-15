import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const user = {
	email: 'a@a.ru',
	password: '123'
}

const posts = [
	{
		title: 'Новый пост',
		content: 'Новый контент',
	},
	{
		title: 'Второй пост',
		content: 'Second content',
	},
]

async function main() {
	await prisma.$connect();
	const createdUser = await prisma.user.create({ data: user });
	await prisma.post.createMany({
		data: posts.map(p => ({ ...p, authorId: createdUser.id }))
	})
}

main();