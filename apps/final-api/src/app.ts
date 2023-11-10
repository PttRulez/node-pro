import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { json } from 'express';
import { IConfigService } from './config/config.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { UsersRepository } from './users/users.repository';
import { GoodsController } from './goods/goods.controller';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.UsersRepository) private authRepository: UsersRepository,
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.GoodsController) private goodsController: GoodsController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddlewares(): void {
		this.app.use(json());
		const authMiddlewre = new AuthMiddleware(this.configService.get('SECRET'), this.authRepository);
		this.app.use(authMiddlewre.execute.bind(authMiddlewre));
	}

	useRoutes(): void {
		this.app.use('/auth', this.authController.router);
		this.app.use('/goods', this.goodsController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
