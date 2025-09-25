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
	deleteProject: (project: Project) => void;
	getTrans: (project: Project) => Fund[];
	addTrans: (project: Project, cents: number, reason: string) => void;
	getFunds: (project: Project) => number;
};
store.current = { ...defaultStore, ...store.current };

store.getProject = (id) => store.current.projects.find((p) => p.id === id);
store.addProject = (name: string) => {
	store.current.projects.push({ id: nanoid(), name });
	return store.current.projects[store.current.projects.length - 1];
};
store.deleteProject = (project: Project) => {
	store.current.projects = store.current.projects.filter((p) => p.id !== project.id);
	store.current.funds = store.current.funds.filter((f) => f.project !== project.id);
};
store.getTrans = (project: Project) => store.current.funds.filter((f) => f.project === project.id);
store.addTrans = (project: Project, cents: number, reason: string) =>
	store.current.funds.push({
		project: project.id,
		amount: cents,
		reason,
		date: new Date().getTime(),
		id: nanoid()
	});
store.getFunds = (project: Project) => sum(store.getTrans(project));
