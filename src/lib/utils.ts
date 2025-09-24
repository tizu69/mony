export function sum<K extends keyof T, T extends Record<K, number>>(
	array: T[],
	key: K = 'amount' as K
): number {
	return array.reduce((total, item) => total + item[key], 0);
}
