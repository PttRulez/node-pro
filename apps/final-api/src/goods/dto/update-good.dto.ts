import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGoodDto {
	@IsOptional()
	@IsNumber()
	amount: number;

	@IsNumber()
	id: number;

	@IsString()
	description: string;

	@IsOptional()
	@IsString({ message: 'Введите название товара' })
	name: string;

	@IsOptional()
	@IsNumber()
	price: number;
}
