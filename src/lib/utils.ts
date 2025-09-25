export function sum<K extends keyof T, T extends Record<K, number>>(
	array: T[],
	key: K = 'amount' as K
): number {
	return array.reduce((total, item) => total + item[key], 0);
}

export const interpolate = (v: number, rin: [number, number], rout: [number, number]) =>
	rout[0] + ((v - rin[0]) / (rin[1] - rin[0])) * (rout[1] - rout[0]);
