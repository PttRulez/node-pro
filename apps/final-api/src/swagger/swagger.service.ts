import swaggerAutogen from 'swagger-autogen';
import { AuthController } from '../auth/auth.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { GoodsController } from '../goods/goods.controller';

@injectable()
export class SwaggerService {
	constructor(
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.GoodsController) private goodsController: GoodsController,
	) {}

	async generateSwagger(): Promise<void> {
		const doc = {
			info: {
				title: 'Goods API',
				description: 'Purple school nodeJS course',
			},
			host: 'localhost:3005',
		};

		const outputFile = './swagger-output.json';
		const routes = [this.authController.router, this.goodsController.router];

		try {
			const result = await swaggerAutogen()(outputFile, routes, doc);
		} catch (e) {
			console.log('SWAGGER FAILED', e);
		}
	}
}

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
