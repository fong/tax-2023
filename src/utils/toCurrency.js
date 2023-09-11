Number.prototype.toCurrency = function (dp = 0) {
	return this.valueOf().toLocaleString('en-NZ', {
		style: 'currency',
		currency: 'NZD',
		maximumFractionDigits: dp
	});
};
