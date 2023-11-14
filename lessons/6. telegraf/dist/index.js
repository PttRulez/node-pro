"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const telegraf_session_local_1 = __importDefault(require("telegraf-session-local"));
const { leave } = telegraf_1.Scenes.Stage;
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    throw new Error('Не задан token');
}
const testScene = new telegraf_1.Scenes.BaseScene('test');
testScene.enter((ctx) => ctx.reply('Привет!'));
testScene.command('back', leave());
testScene.on((0, filters_1.message)('text'), (ctx) => ctx.reply('Scene reply ' + ctx.message.text));
testScene.leave((ctx) => ctx.reply('Пока!'));
const stage = new telegraf_1.Scenes.Stage([testScene]);
const bot = new telegraf_1.Telegraf(token);
bot.use(stage.middleware());
bot.use(new telegraf_session_local_1.default({ database: 'session.json' }).middleware());
bot.use((ctx, next) => {
    next();
});
bot.command('enter_test', (ctx) => ctx.scene.enter('test'));
bot.launch();
