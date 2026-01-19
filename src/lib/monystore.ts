import { nanoid } from 'nanoid';
import { persistedState } from 'svelte-persisted-state';
import type { Project, Trans } from './types';
import { sum } from './utils';

export const defaultStore = {
	projects: [] as Project[],
	trans: [] as Trans[],

	locale: 'de',
	currency: 'EUR',
	fullscreenModal: false
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
	getFunds: (project: Project, type?: '-' | '+') => number;
	canDeleteTrans: (trans: Trans) => boolean;
	getFundsUsedInTime: (project: Project, hours: number) => number;
	getWeightedFundsUsed: (project: Project) => number;
	getSpendingByDay: (project: Project, days: number) => { day: Date; amount: number }[];
};

function migrations() {
	store.current = { ...defaultStore, ...store.current };
	store.current.trans = store.current.trans.map((t) =>
		t.items === undefined ? { ...t, items: [] } : t
	);
}
migrations();

store.getProjects = () =>
	store.current.projects.toSorted((a, b) => {
		const aTrans = store.getTrans(a).at(-1);
		const bTrans = store.getTrans(b).at(-1);
		if (!aTrans && !bTrans) return 0;
		// projects without transactions should be at the start
		if (!aTrans) return -1;
		// .. so that they're easier to notice & fill out or remove
		if (!bTrans) return 1;
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
		id: nanoid(),
		items: []
	});
store.deleteTrans = (trans: Trans) => {
	store.current.trans = store.current.trans.filter((t) => t.id !== trans.id);
};
store.getFunds = (project: Project, type?: '-' | '+') =>
	sum(
		store.getTrans(project),
		(t) => !type || (t.amount < 0 && type === '-') || (t.amount > 0 && type === '+')
	);
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
store.getWeightedFundsUsed = (project: Project) => {
	const windows = [
		{ hours: 24, weight: 0.6 },
		{ hours: 24 * 7, weight: 0.3 },
		{ hours: 24 * 30, weight: 0.1 }
	];

	let weightedRateSum = 0;
	let weightSum = 0;
	for (const window of windows) {
		const fundsUsed = store.getFundsUsedInTime(project, window.hours);
		if (fundsUsed > 0) {
			const rate = fundsUsed / (window.hours / 24); // daily rate
			weightedRateSum += rate * window.weight;
			weightSum += window.weight;
		}
	}

	if (weightSum === 0) return 0;
	return weightedRateSum / weightSum;
};
store.getSpendingByDay = (project: Project, days: number) => {
	const spendingByDay: { day: Date; amount: number }[] = [];
	const now = new Date();

	const trans = store.getTrans(project).filter((t) => t.amount < 0);

	for (let i = 0; i < days; i++) {
		const day = new Date(now);
		day.setDate(now.getDate() - i);
		day.setHours(0, 0, 0, 0);
		const endOfDay = new Date(day);
		endOfDay.setHours(23, 59, 59, 999);

		const dayTrans = trans.filter((t) => t.date >= day.getTime() && t.date <= endOfDay.getTime());
		const amount = -sum(dayTrans);

		spendingByDay.push({ day, amount });
	}

	return spendingByDay.reverse(); // from oldest to newest
};
