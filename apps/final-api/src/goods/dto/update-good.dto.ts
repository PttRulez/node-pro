import { IsDecimal, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class UpdateGoodDto {
	@IsOptional()
	@IsNumber()
	amount: number;

	@IsNumber()
	id: number;

	@IsOptional()
	@IsEmail({}, { message: 'Введите название товара' })
	name: string;

	@IsOptional()
	@IsDecimal()
	price: number;
}
