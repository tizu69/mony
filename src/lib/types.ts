export interface Fund {
	id: string;
	date: string; // ISO date string
	amount: number; // in cents
	reason: string;
}
