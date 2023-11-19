export class Good {
	amount: number;
	description: string;
	id: number;
	imageUrl: string | null;
	name: string;
	price: number;

	constructor(good: Good) {
		this.amount = good.amount;
		this.description = good.description;
		this.id = good.id;
		this.imageUrl = good.imageUrl;
		this.name = good.name;
		this.price = good.price;
	}
}
