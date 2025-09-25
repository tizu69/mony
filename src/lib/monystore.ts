import { persistedState } from 'svelte-persisted-state';
import type { Trans, Project } from './types';
import { sum } from './utils';
import { nanoid } from 'nanoid';

export const defaultStore = {
	projects: [] as Project[],
	trans: [] as Trans[],

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
	getTrans: (project: Project) => Trans[];
	addTrans: (project: Project, cents: number, reason: string) => void;
	deleteTrans: (trans: Trans) => void;
	getFunds: (project: Project) => number;
	getFundsWithoutTrans: (trans: Trans) => number;
};
store.current = { ...defaultStore, ...store.current };

store.getProject = (id) => store.current.projects.find((p) => p.id === id);
store.addProject = (name: string) => {
	store.current.projects.push({ id: nanoid(), name });
	return store.current.projects[store.current.projects.length - 1];
};
store.deleteProject = (project: Project) => {
	store.current.projects = store.current.projects.filter((p) => p.id !== project.id);
	store.current.trans = store.current.trans.filter((f) => f.project !== project.id);
};
store.getTrans = (project: Project) => store.current.trans.filter((f) => f.project === project.id);
store.addTrans = (project: Project, cents: number, reason: string) =>
	store.current.trans.push({
		project: project.id,
		amount: cents,
		reason,
		date: new Date().getTime(),
		id: nanoid()
	});
store.deleteTrans = (trans: Trans) => {
	store.current.trans = store.current.trans.filter((t) => t.id !== trans.id);
};
store.getFunds = (project: Project) => sum(store.getTrans(project));
store.getFundsWithoutTrans = (trans: Trans) =>
	sum(store.getTrans(store.getProject(trans.project)!).filter((t) => t.id !== trans.id));
