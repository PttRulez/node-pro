export class Good {
	private amount: number;
	private name: string;
	private price: number;

	constructor(good: Good) {
		this.amount = good.amount;
		this.name = good.name;
		this.price = good.price;
	}
}
