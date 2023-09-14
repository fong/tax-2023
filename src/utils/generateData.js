const income_max = 9999999;

export const bracketStatusQuo = [
	[0, 14000, 0.105],
	[14000, 48000, 0.175],
	[48000, 70000, 0.3],
	[70000, 180000, 0.33],
	[180000, income_max, 0.39]
];

export const bracketsNational = [
	[0, 15600, 0.105],
	[15600, 53500, 0.175],
	[53500, 78100, 0.3],
	[78100, 180000, 0.33],
	[180000, income_max, 0.39]
];

export const bracketsTOP = [
	[0, 15000, 0],
	[15000, 80000, 0.2],
	[80000, 180000, 0.35],
	[180000, 250000, 0.42],
	[250000, income_max, 0.45]
];

export const bracketsAct = [
	[0, 70000, 0.175],
	[70000, income_max, 0.28]
];

export const bracketsGreens = [
	[0, 10000, 0],
	[10000, 50000, 0.17],
	[50000, 75000, 0.3],
	[75000, 120000, 0.35],
	[120000, 180000, 0.39],
	[180000, income_max, 0.45]
];

export const bracketsTPM = [
	[0, 30000, 0],
	[30000, 60000, 0.15],
	[60000, 90000, 0.33],
	[90000, 180000, 0.39],
	[180000, 300000, 0.42],
	[300000, income_max, 0.48]
];

export const calculateTax = (income, brackets) => {
	let totalTaxes = 0;
	for (const interval of brackets) {
		if (income < interval[1]) {
			totalTaxes += (income - interval[0]) * interval[2];
			break;
		} else {
			totalTaxes += (interval[1] - interval[0]) * interval[2];
		}
	}

	return totalTaxes;
};

export const calculateTaxPercent = (income, brackets) => {
	let totalTaxes = 0;
	for (const interval of brackets) {
		if (income < interval[1]) {
			totalTaxes += (income - interval[0]) * interval[2];
			break;
		} else {
			totalTaxes += (interval[1] - interval[0]) * interval[2];
		}
	}

	return +(totalTaxes / income || brackets[0][2]).toFixed(8);
};

// ACT's tax offset for $12k-$58k
export const lmito = (income) => {
	if (income < 2000) {
		return 0;
	} else if (income < 12000) {
		return (income - 2000) * 0.08;
	} else if (income < 48000) {
		return 800;
	} else if (income < 58000) {
		return 800 - (income - 48000) * 0.08;
	} else {
		return 0;
	}
};
