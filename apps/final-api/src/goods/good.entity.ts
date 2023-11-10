export interface IGoodConstructor {
	amount: number;
	name: string;
	price: number;
}

export class Good {
	private amount: number;
	private name: string;
	private price: number;

	constructor(good: IGoodConstructor) {
		this.amount = good.amount;
		this.name = good.name;
		this.price = good.price;
	}
}
