export class Good {
	id: number;
	amount: number;
	name: string;
	price: number;

	constructor(good: Good) {
		this.id = good.id;
		this.amount = good.amount;
		this.name = good.name;
		this.price = good.price;
	}
}
