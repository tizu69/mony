export interface Project {
	id: string;
	name: string;
}

export interface Fund {
	project: string;
	id: string;
	date: string; // ISO date string
	amount: number; // in cents
	reason: string;
}
