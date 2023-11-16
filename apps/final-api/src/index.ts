import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { AuthController } from './auth/auth.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IAuthService } from './auth/auth.service.interface';
import { IAuthController } from './auth/auth.controller.interface';
import { AuthService } from './auth/auth.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './auth/users.repository.interface';
import { UsersRepository } from './auth/users.repository';
import { IGoodsController } from './goods/goods.controller.interface';
import { IGoodsService } from './goods/goods.service.interface';
import { IGoodsRepository } from './goods/goods.repository.interface';
import { GoodsController } from './goods/goods.controller';
import { GoodsService } from './goods/goods.service';
import { GoodsRepository } from './goods/goods.repository';
import { SwaggerService } from './swagger/swagger.service';
import { TelegramService } from './telegram/telegram.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App).inSingletonScope();
	bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
	bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IGoodsController>(TYPES.GoodsController).to(GoodsController).inSingletonScope();
	bind<IGoodsService>(TYPES.GoodsService).to(GoodsService).inSingletonScope();
	bind<IGoodsRepository>(TYPES.GoodsRepository).to(GoodsRepository).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<SwaggerService>(TYPES.SwaggerService).to(SwaggerService).inSingletonScope();
	bind<TelegramService>(TYPES.TelegramService).to(TelegramService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	// const swagger = appContainer.get<SwaggerService>(TYPES.SwaggerService);
	await app.init();
	const telegramBot = appContainer.get<TelegramService>(TYPES.TelegramService);
	await telegramBot.start();
	// swagger.generateSwagger();
	return { appContainer, app };
}

export const boot = bootstrap();
