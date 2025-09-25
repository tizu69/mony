import { persistedState } from 'svelte-persisted-state';
import type { Fund, Project } from './types';
import { sum } from './utils';
import { nanoid } from 'nanoid';

export const defaultStore = {
	projects: [] as Project[],
	funds: [] as Fund[],

	locale: 'de-DE',
	currency: 'EUR'
};

export type Store = typeof defaultStore;

export const store = persistedState<Store>('mony', defaultStore) as {
	value: Store;
	current: Store;
	reset: () => void;

	getProject: (id: string) => Project | undefined;
	addProject: (name: string) => Project;
	getWalletFunds: (project: Project) => number;
	addWalletFund: (project: Project, cents: number, reason: string) => void;
};
store.current = { ...defaultStore, ...store.current };

store.getProject = (id) => store.current.projects.find((p) => p.id === id);
store.addProject = (name: string) => {
	store.current.projects.push({ id: nanoid(), name });
	return store.current.projects[store.current.projects.length - 1];
};
store.getWalletFunds = (project: Project) =>
	sum(store.current.funds.filter((f) => f.project === project.id));
store.addWalletFund = (project: Project, cents: number, reason: string) =>
	store.current.funds.push({
		project: project.id,
		amount: cents,
		reason,
		date: new Date().toISOString(),
		id: nanoid()
	});
