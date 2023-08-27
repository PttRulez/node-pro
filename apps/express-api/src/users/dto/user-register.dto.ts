import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверный формат ящика' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;
}
