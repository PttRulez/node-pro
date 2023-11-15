import 'dotenv/config';
import { Context, Scenes, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import LocalSession from 'telegraf-session-local';

const { leave } = Scenes.Stage;

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
	throw new Error('Не задан token');
}

interface MySessionData extends Scenes.SceneSessionData {
	myProp: string;
}

interface MySession extends Scenes.SceneSession<MySessionData> {
	oneMore: number;
}

interface MyContext extends Context {
	props: string;
	session: MySession;
	scene: Scenes.SceneContextScene<MyContext, MySessionData>;
}

const testScene = new Scenes.BaseScene<MyContext>('test');
testScene.enter((ctx) => ctx.reply('Привет!'));
testScene.command('back', leave<MyContext>());
testScene.on(message('text'), (ctx) => ctx.reply('Scene reply ' + ctx.message.text));
testScene.leave((ctx) => ctx.reply('Пока!'));

const stage = new Scenes.Stage<MyContext>([testScene]);

const bot = new Telegraf<MyContext>(token);

bot.use(new LocalSession({ database: 'session.json' }).middleware());
bot.use(stage.middleware());

bot.command('test_enter', (ctx) => ctx.scene.enter('test'));

bot.launch();
