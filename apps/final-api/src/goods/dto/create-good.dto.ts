import { IsDecimal, IsEmail, IsNumber } from 'class-validator';

export class CreateGoodDto {
	@IsEmail({}, { message: 'Введите название товара' })
	name: string;

	@IsDecimal()
	price: number;

	@IsNumber()
	amount: number;
}
