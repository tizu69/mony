import { persistedState } from 'svelte-persisted-state';
import type { Fund } from './types';
import { sum } from './utils';
import { nanoid } from 'nanoid';

export const defaultStore = {
	funds: [] as Fund[],

	locale: 'de-DE',
	currency: 'EUR'
};

export type Store = typeof defaultStore;

export const store = persistedState<Store>('mony', defaultStore) as {
	value: Store;
	current: Store;
	reset: () => void;

	getWalletFunds: () => number;
	addWalletFund: (cents: number, reason: string) => void;
};
store.current = { ...defaultStore, ...store.current };

store.getWalletFunds = () => sum(store.current.funds);
store.addWalletFund = (cents: number, reason: string) => {
	store.current.funds.push({
		amount: cents,
		reason,
		date: new Date().toISOString(),
		id: nanoid()
	});
};
