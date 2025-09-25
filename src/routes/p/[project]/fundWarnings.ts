const MIN_FUNDS_THRESHOLD = 20_00;
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
				waitFor: -1
			};
		if (funds < MIN_FUNDS_THRESHOLD)
			return {
				title: 'Low on funds',
				text: 'Your balance is quite low. Consider only essential purchases.',
				waitFor: 2
			};
		if (fundsAfter < MIN_FUNDS_THRESHOLD)
			return {
				title: 'Targeting low funds',
				text: `This purchase would leave you with very low funds. Consider keeping some funds for essentials.`,
				waitFor: 3
			};
		if (amount > funds * 0.5)
			return {
				title: 'Large purchase',
				text: `This will use ${Math.round((amount / funds) * 100)}% of your available funds. Continue?`,
				waitFor: 5
			};
	} else {
		if (!isFirstTrans)
			return {
				title: 'Already added funds',
				text: 'You have already added funds. Adding more may indicate overspending habits - continue anyway?',
				waitFor: 5
			};
	}
};
