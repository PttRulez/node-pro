import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGoodDto {
	@IsNumber()
	amount: number;

	@IsString()
	description: string;

	@IsString()
	@IsOptional()
	imageUrl: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	price: number;
}
