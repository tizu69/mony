export interface Project {
	id: string;
	name: string;
}

export interface Trans {
	project: string;
	id: string;
	/** unix timestamp */
	date: number;
	/** in cents, negative if expense */
	amount: number;
	reason: string;
	items: TransItem[];
}

export interface TransItem {
	/** In cents, always positive. All items' amounts add up to |trans.amount|.
	 * Check if trans.amount < 0 to determine if it's an expense. */
	amount: number;
	name: string;
}
