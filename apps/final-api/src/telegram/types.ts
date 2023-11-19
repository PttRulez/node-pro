import { Good } from 'src/goods/good.entity';
import { Context, Scenes } from 'telegraf';

// сцена сессии
export interface ShopSessionScene extends Scenes.SceneSessionData {
	offset: number;
}

// сессия
export interface ShopSession extends Scenes.SceneSession<ShopSessionScene> {
	address: string;
	cart: Record<string, number>;
	currentPage: number;
	goodsList: Array<Good>;
	limit: number;
	name: string;
	offset: number;
}

export interface MyContext extends Context {
	props: string;
	session: ShopSession;
	scene: Scenes.SceneContextScene<MyContext, ShopSessionScene>;
}
