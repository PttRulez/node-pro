import { inject, injectable } from 'inversify';
import { ITelegramService } from './telegram.service.interface';
import { Context, Telegraf } from 'telegraf';
import { ILogger } from '@/logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class TelegramService implements ITelegramService {
	private bot: Telegraf;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		if (!process.env.TELEGRAM_BOT_TOKEN) {
			console.log('ТГ бот не запустился, т.к. не удалось получить ключ из .env');
			return;
		}
		this.bot = new Telegraf<Context>(process.env.TELEGRAM_BOT_TOKEN);
	}

	start(): void {
		this.bot.command('start', (ctx: Context) => ctx.reply('Превед медвед'));
		this.bot.launch();
	}
}
