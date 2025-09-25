export interface Project {
	id: string;
	name: string;
}

export interface Trans {
	project: string;
	id: string;
	date: number; // unix timestamp
	amount: number; // in cents
	reason: string;
}
