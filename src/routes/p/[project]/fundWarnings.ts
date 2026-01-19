const MIN_FUNDS_THRESHOLD = 7_00;
const wait = {
	block: -1,
	warning: 2,
	danger: 5
} as const;

export default (
	isExpense: boolean,
	amount: number,
	funds: number,
	fundsAfter: number,
	isFirstTrans: boolean
) => {
	if (isExpense) {
		if (funds < amount)
			return {
				title: 'Insufficient funds',
				text: 'You do not have enough funds for this purchase.',
				waitFor: wait.block
			};
		if (funds < MIN_FUNDS_THRESHOLD)
			return {
				title: 'Low on funds',
				text: 'Your balance is quite low. Consider only essential purchases.',
				waitFor: wait.warning
			};
		if (fundsAfter < MIN_FUNDS_THRESHOLD)
			return {
				title: 'Targeting low funds',
				text: `This purchase would leave you with very low funds. Consider keeping some funds for essentials.`,
				waitFor: wait.warning
			};
		if (amount > funds * 0.5)
			return {
				title: 'Large purchase',
				text: `This will use ${Math.round((amount / funds) * 100)}% of your available funds. Continue?`,
				waitFor: wait.danger
			};
	} else {
		if (!isFirstTrans)
			return {
				title: 'Already added funds',
				text: 'You have already added funds. Adding more may indicate overspending habits - continue anyway?',
				waitFor: wait.danger
			};
	}
};
