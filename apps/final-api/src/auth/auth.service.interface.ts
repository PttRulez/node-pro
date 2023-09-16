import { UserModel } from '@prisma/client';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

export interface IAuthService {
	createUser: (dto: AuthRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: AuthLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
