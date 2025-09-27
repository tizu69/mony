export function sum<T extends { amount: number }>(
	array: T[],
	cond: (key: T) => boolean = () => true
): number {
	return array.reduce((total, item) => {
		if (!cond(item)) return total;
		return total + item.amount;
	}, 0);
}

export const interpolate = (v: number, rin: [number, number], rout: [number, number]) =>
	rout[0] + ((v - rin[0]) / (rin[1] - rin[0])) * (rout[1] - rout[0]);
