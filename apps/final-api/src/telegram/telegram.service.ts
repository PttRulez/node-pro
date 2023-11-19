import { inject, injectable } from 'inversify';
import { ITelegramService } from './telegram.service.interface';
import { Telegraf, Scenes } from 'telegraf';
import { TYPES } from '../types/types';
import { MyContext, ShopSession, ShopSessionScene } from './types';
import { message } from 'telegraf/filters';
import LocalSession from 'telegraf-session-local';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { IGoodsService } from 'src/goods/goods.service.interface';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
import { escapeString } from '../utils';

const ASK_NAME_SCENE_NAME = 'ask_name';
const ASK_ADDRESS_SCENE_NAME = 'ask_address';
const CART_SCENE_NAME = 'cart';
const SHOP_SCENE_NAME = 'shop';
const USER_SCENE_NAME = 'user';

const clickNextActionName: string = 'click_next';
const clickPrevActionName: string = 'click_prev';
const confirmOrderAction: string = 'confirmOrder';

@injectable()
export class TelegramService implements ITelegramService {
	private askNameScene: Scenes.BaseScene<MyContext>;
	private askAddressScene: Scenes.BaseScene<MyContext>;
	private bot: Telegraf<MyContext>;
	private stage: Scenes.Stage<MyContext>;
	private shopScene: Scenes.BaseScene<MyContext>;
	private cartScene: Scenes.BaseScene<MyContext>;
	private offset: number = 0;
	private limit: number = 2;

	constructor(@inject(TYPES.GoodsService) private goodsService: IGoodsService) {
		if (!process.env.TELEGRAM_BOT_TOKEN) {
			console.log('ТГ бот не запустился, т.к. не удалось получить ключ из .env');
			return;
		}

		this.bot = new Telegraf<MyContext>(process.env.TELEGRAM_BOT_TOKEN);
	}

	// Creating Scenes
	createAskNameScene(): Scenes.BaseScene<MyContext> {
		const scene = new Scenes.BaseScene<MyContext>(ASK_NAME_SCENE_NAME);

		scene.enter(async (ctx) => {
			ctx.reply('Введите имя', {
				reply_markup: {
					force_reply: true,
					input_field_placeholder: 'Ваше имя',
				},
			});
		});

		scene.on(message('text'), (ctx) => {
			ctx.session.name = ctx.message.text;
			ctx.reply(`Имя изменено на ${ctx.message.text}`);
			ctx.scene.leave();
			this.checkAllInfoFilled(ctx);
		});

		this.askNameScene = scene;

		return scene;
	}

	createAskAddressScene(): Scenes.BaseScene<MyContext> {
		const scene = new Scenes.BaseScene<MyContext>(ASK_ADDRESS_SCENE_NAME);

		scene.enter(async (ctx) => {
			ctx.reply('Введите ваш адрес', {
				reply_markup: {
					force_reply: true,
					input_field_placeholder: 'Ваш адрес',
				},
			});
		});

		scene.on(message('text'), (ctx) => {
			ctx.session.address = ctx.message.text;
			ctx.reply(`Адрес изменен на ${ctx.message.text}`);
			ctx.scene.leave();
			this.checkAllInfoFilled(ctx);
		});

		this.askAddressScene = scene;

		return scene;
	}

	createCartScene(): Scenes.BaseScene<MyContext> {
		const scene = new Scenes.BaseScene<MyContext>(CART_SCENE_NAME);

		scene.enter(async (ctx) => {
			this.showCart(ctx);
		});

		scene.command('leave', (ctx) => {
			ctx.scene.leave();
		});

		scene.action(confirmOrderAction, async (ctx) => {
			const success = await this.goodsService.buy(ctx.session.cart);
			if (success) {
				ctx.reply(`Заказ успешно оформлен\r\nБудет доставлен по адресу ${ctx.session.address}`);
				ctx.session.cart = {};
			} else {
				ctx.reply('Не получилось оформить заказ :(');
			}
		});

		this.cartScene = scene;
		return scene;
	}

	createShopScene(): Scenes.BaseScene<MyContext> {
		const scene = new Scenes.BaseScene<MyContext>(SHOP_SCENE_NAME);

		scene.enter((ctx) => {
			if (!ctx.session.name || !ctx.session.address) ctx.scene.enter(USER_SCENE_NAME);
			this.getListOfGoods(ctx);
		});

		scene.command('leave', (ctx) => {
			ctx.scene.leave();
		});

		scene.on(message('text'), (ctx) => ctx.reply('Товары reply'));

		this.shopScene = scene;
		return scene;
	}

	// Helepr Methods
	checkAllInfoFilled(ctx: MyContext): boolean {
		if (!ctx.session?.name) {
			ctx.scene.enter(ASK_NAME_SCENE_NAME);
			return false;
		} else if (!ctx.session?.address) {
			ctx.scene.enter(ASK_ADDRESS_SCENE_NAME);
			return false;
		}
		return true;
	}

	async getListOfGoods(ctx: MyContext): Promise<void> {
		const { goods, count, currentPage, totalPages } = await this.goodsService.getList({
			offset: ctx.session.offset,
			limit: ctx.session.limit,
		});

		await ctx.reply(
			`Товары ${ctx.session.offset + 1} - ${ctx.session.offset + ctx.session.limit} из ${count}`,
		);

		for (let i = 0; i < goods.length; i++) {
			const good = goods[i];
			const descriptionActionName = `description ${good.id}`;
			const buyActionName = `buy ${good.id}`;

			// Подписка на нажатие кнопки подробнее
			this.shopScene.action(descriptionActionName, (ctx) => {
				if (good.imageUrl) {
					// Если будет у товара урл картинки то отображаем с картинкой описание
					ctx.replyWithPhoto(good.imageUrl, {
						caption: `*${escapeString(good.name)}*\n${escapeString(good.description)}`, // eslint-disable-current-line @typescript-eslint/no-useless-escape
						parse_mode: 'MarkdownV2',
						reply_markup: {
							inline_keyboard: [[{ text: 'Купить', callback_data: buyActionName }]],
						},
					});
				} else {
					// В противном случае просто описание
					ctx.reply(good.name, {
						reply_markup: {
							inline_keyboard: [[{ text: 'Купить', callback_data: buyActionName }]],
						},
					});
				}

				// Подписка на нажатие кнопки купить
				this.shopScene.action(buyActionName, (ctx) => {
					if (good.amount - (ctx.session.cart[good.id] ?? 0) <= 0) {
						ctx.reply(`Товара ${good.name} больше не осталось на остатках`);
					} else if (!ctx.session.cart[good.id]) {
						good.amount -= 1;
						ctx.session.cart[good.id] = 1;
					} else {
						good.amount -= 1;
						ctx.session.cart[good.id] += 1;
					}

					ctx.reply(
						`'${good.name}' Кол-во в корзинe: ${ctx.session.cart[good.id]}\r\n` +
							'Перейти в корзину можно нажав на кнопку на клавиутуре внизу',
					);
				});
			});

			const replyOptions: ExtraReplyMessage & {
				reply_markup: { inline_keyboard: InlineKeyboardButton[][] };
			} = {
				reply_markup: {
					inline_keyboard: [[{ text: 'Подробнее', callback_data: descriptionActionName }]],
				},
			};

			this.shopScene.action(clickPrevActionName, (ctx: MyContext) => {
				ctx.session.offset = ctx.session.offset - ctx.session.limit;
				this.getListOfGoods(ctx);
			});

			this.shopScene.action(clickNextActionName, (ctx: MyContext) => {
				ctx.session.offset = ctx.session.offset + ctx.session.limit;
				this.getListOfGoods(ctx);
			});

			if (i + 1 === goods.length) {
				let pagination: InlineKeyboardButton.CallbackButton[] = [];

				if (currentPage === 1) {
					pagination = [{ text: '>', callback_data: clickNextActionName }];
				} else if (currentPage === totalPages) {
					pagination = [{ text: '<', callback_data: clickPrevActionName }];
				} else {
					pagination = [
						{ text: '<', callback_data: clickPrevActionName },
						{ text: '>', callback_data: clickNextActionName },
					];
				}

				replyOptions.reply_markup.inline_keyboard.push(pagination);
			}

			await ctx.reply(good.name, replyOptions);
		}
	}

	async showCart(ctx: MyContext): Promise<void> {
		await ctx.reply('Ваша корзина:');
		const ids = Object.keys(ctx.session.cart).map((c) => parseInt(c));
		const goods = await this.goodsService.getListByIds(ids);

		if (goods.length > 0) {
			for (let i = 0; i < goods.length; i++) {
				const good = goods[i];
				const minusActionName = `minus ${good.id}`;

				const inlineKeyboard = [[{ text: '-1', callback_data: minusActionName }]];

				if (i === goods.length - 1) {
					inlineKeyboard.push([{ text: 'Оформить заказ', callback_data: confirmOrderAction }]);
				}

				await ctx.reply(`${good.name}. Кол-во в корзине: ${ctx.session.cart[good.id]}`, {
					reply_markup: {
						inline_keyboard: inlineKeyboard,
					},
				});

				this.cartScene.action(minusActionName, (actionCtx) => {
					actionCtx.session.cart[good.id] -= 1;

					if (actionCtx.session.cart[good.id] <= 0) delete actionCtx.session.cart[good.id];

					this.showCart(ctx);
				});
			}
		} else {
			ctx.reply('Корзина пуста');
		}
	}

	// Managing bot

	async start(): Promise<void> {
		// Добавляем хранилище сессии
		this.bot.use(
			new LocalSession<ShopSession>({
				database: 'session.json',
			}).middleware(),
		);

		// Создаем stage, куда добавляем сцену и используем её в боте через миддлвэр
		const stage = new Scenes.Stage<MyContext, ShopSessionScene>([
			this.createAskAddressScene(),
			this.createAskNameScene(),
			this.createShopScene(),
			this.createCartScene(),
		]);

		stage.command('cart', (ctx) => {
			ctx.scene.enter(CART_SCENE_NAME);
		});

		stage.command('shop', (ctx) => {
			ctx.scene.enter(SHOP_SCENE_NAME);
		});

		stage.command('user', (ctx) => {
			ctx.scene.enter(USER_SCENE_NAME);
		});

		this.bot.use((ctx, next) => {
			if (!ctx.session.offset) {
				ctx.session.offset = this.offset;
			}

			if (!ctx.session.cart) {
				ctx.session.cart = {};
			}

			if (!ctx.session.limit) {
				ctx.session.limit = this.limit;
			}
			next();
		});

		this.bot.use(stage.middleware());

		this.bot.command('shop', (ctx) => {
			ctx.scene.enter(SHOP_SCENE_NAME);
		});

		this.bot.command('cart', (ctx) => {
			ctx.scene.enter(CART_SCENE_NAME);
		});

		this.bot.command('user', (ctx) => {
			ctx.scene.enter(USER_SCENE_NAME);
		});

		this.bot.command('stop', (ctx) => {
			this.bot.stop();
		});

		this.bot.on(message('text'), (ctx) => {
			if (this.checkAllInfoFilled(ctx)) {
				ctx.reply(
					'Список товаров - /shop\r\n' +
						'Задать имя юзера - /name\r\n' +
						'Задать адрес юзера - /address\r\n' +
						'Корзина - /cart',
				);
			}
		});

		await this.bot.launch();

		this.checkAllInfoFilled(this.bot.context as MyContext);
	}

	stop(): void {
		this.bot.stop();
	}
}
