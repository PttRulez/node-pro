import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Введите нормальный email' })
	email: string;

	@IsString({ message: 'Укажите пароль' })
	password: string;
}
