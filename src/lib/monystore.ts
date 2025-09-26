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

	getProjects: () => Project[];
	getProject: (id: string) => Project | undefined;
	addProject: (name: string) => Project;
	deleteProject: (project: Project) => void;
	getTrans: (project: Project) => Trans[];
	addTrans: (project: Project, cents: number, reason: string) => void;
	deleteTrans: (trans: Trans) => void;
	getFunds: (project: Project) => number;
	canDeleteTrans: (trans: Trans) => boolean;
	getFundsUsedInTime: (project: Project, hours: number) => number;
};
store.current = { ...defaultStore, ...store.current };

store.getProjects = () =>
	store.current.projects.toSorted((a, b) => {
		const aTrans = store.getTrans(a).at(-1);
		const bTrans = store.getTrans(b).at(-1);
		if (!aTrans || !bTrans) return 0;
		return bTrans.date - aTrans.date;
	});
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
store.canDeleteTrans = (trans: Trans) => {
	const transForProject = store
		.getTrans(store.getProject(trans.project)!)
		.sort((a, b) => a.date - b.date);

	let balance = 0;
	for (const t of transForProject) {
		if (t.id === trans.id) continue;
		balance += t.amount;
		if (balance < 0) return false;
	}
	return true;
};
store.getFundsUsedInTime = (project: Project, hours: number) => {
	const time = new Date().getTime() - 60 * 60 * 1000 * hours;
	const trans = store.getTrans(project).filter((f) => f.amount < 0 && f.date > time);
	const result = sum(trans);
	if (result < 0) return -result;
	return 0;
};
