export interface Project {
	id: string;
	name: string;
}

export interface Fund {
	project: string;
	id: string;
	date: number; // unix timestamp
	amount: number; // in cents
	reason: string;
}
