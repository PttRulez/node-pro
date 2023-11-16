import { Context, Scenes } from 'telegraf';

// сцена сессии
export interface UserSessionScene extends Scenes.SceneSessionData {}

// сессия
export interface UserSession extends Scenes.SceneSession<UserSessionScene> {
	name: string;
	address: string;
}

export interface MyContext extends Context {
	props: string;
	session: UserSession;
	scene: Scenes.SceneContextScene<MyContext, UserSessionScene>;
}

// export interface MyContext extends Context {
// 	props: string;
// 	session: MySession;
// 	scene: Scenes.SceneContextScene<MyContext, MySessionData>;
// }
