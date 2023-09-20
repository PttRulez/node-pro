import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from './user.entity';

export interface IAuthService {
	createUser: (dto: AuthRegisterDto) => Promise<User | null>;
	validateUser: (dto: AuthLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<User | null>;
}
