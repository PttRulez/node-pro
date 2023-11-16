import { inject, injectable } from 'inversify';
import { ITelegramService } from './telegram.service.interface';
import { Telegraf, Scenes, NarrowedContext } from 'telegraf';
import { ILogger } from 'src/logger/logger.interface';
import { TYPES } from '../types/types';
import { MyContext } from './types';
import { message } from 'telegraf/filters';
import LocalSession from 'telegraf-session-local';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

const USER_SCENE_NAME = 'user';

@injectable()
export class TelegramService implements ITelegramService {
	private bot: Telegraf<MyContext>;
	private stage: Scenes.Stage<MyContext>;
	private userScene: Scenes.BaseScene<MyContext>;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		if (!process.env.TELEGRAM_BOT_TOKEN) {
			console.log('ТГ бот не запустился, т.к. не удалось получить ключ из .env');
			return;
		}

		this.bot = new Telegraf<MyContext>(process.env.TELEGRAM_BOT_TOKEN);
	}

	askName(ctx: MyContext): void {
		ctx.reply('Превед медвед! Введи своё имя');
	}

	askAddress(ctx: MyContext): void {
		ctx.reply(`${ctx.session.name} введи свой адрес`);
	}

	collectInfo(
		ctx: NarrowedContext<MyContext, Update.MessageUpdate<Record<'text', {}> & Message.TextMessage>>,
	): void {
		if (!ctx.session.name) {
			ctx.session.name = ctx.message.text;
			this.askAddress(ctx);
		} else if (!ctx.session.address) {
			ctx.session.address = ctx.message.text;
			ctx.reply(
				`Ок, тебя зовут ${ctx.session.name}, твой адрес: ${ctx.session.address}, теперь начинай шоппинг`,
			);
		} else {
			ctx.reply(
				`Ок, тебя зовут ${ctx.session.name}, твой адрес: ${ctx.session.address}, теперь начинай шоппинг`,
			);
		}
	}

	createUserScene(): Scenes.BaseScene<MyContext> {
		const userScene = new Scenes.BaseScene<MyContext>(USER_SCENE_NAME);

		userScene.enter((ctx) => {
			if (!ctx.session.name) {
				this.askName(ctx);
			} else if (!ctx.session.address) {
				this.askAddress(ctx);
			} else {
				ctx.reply(
					`Ок, тебя зовут ${ctx.session.name}, твой адрес: ${ctx.session.address}, теперь начинай шоппинг`,
				);
			}
		});

		userScene.command('leave', (ctx) => {
			ctx.scene.leave();
		});
		userScene.leave((ctx) => ctx.reply('Вы вышли с юзер сцены'));

		userScene.on(message('text'), (ctx) => this.collectInfo(ctx));

		return userScene;
	}

	start(): void {
		// Добавляем хранилище сессии
		this.bot.use(new LocalSession({ database: 'session.json' }).middleware());

		// Создаем stage, куда добавляем сцену и используем её в боте через миддлвэр
		const stage = new Scenes.Stage<MyContext>([this.createUserScene()]);
		this.bot.use(stage.middleware());

		// Привязываем к команде /start вход в юзер-сцену
		this.bot.command('start_user', (ctx) => {
			ctx.scene.enter(USER_SCENE_NAME);
		});
		this.bot.command('stop', (ctx) => {
			this.bot.stop();
		});

		this.bot.on(message('text'), (ctx) => ctx.reply('Можете стартануть командой /start_user'));

		this.bot.launch();
	}

	stop(): void {
		this.bot.stop();
	}
}
