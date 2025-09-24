import { persistedState } from 'svelte-persisted-state';
import type { Fund } from './types';

export const defaultConfig = {
	funds: [] as Fund[]
};

export type Config = typeof defaultConfig;

export const config = persistedState<Config>('monycfg', defaultConfig) as {
	value: Config;
	current: Config;
	update: (fn: (c: Config) => Config) => void;
	reset: () => void;
	upgrade: () => void;
};

config.update = (fn) => (config.current = fn(config.current));
config.upgrade = () => {
	config.update((c) => ({ ...defaultConfig, ...c }));
};

config.upgrade();
