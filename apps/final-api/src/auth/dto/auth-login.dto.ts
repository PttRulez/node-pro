import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString()
	password: string;
}
