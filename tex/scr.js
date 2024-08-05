document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tax-form');
    const currencySelect = document.getElementById('currency');
    const resultDiv = document.getElementById('result');
    const taxAmountP = document.getElementById('tax-amount');
    const currencyValueP = document.getElementById('currency-value');

    // Define tax slabs and rates (Indian tax system)
    const taxSlabs = [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.1 },
        { limit: 5000000, rate: 0.2 },
        { limit: Infinity, rate: 0.3 }
    ];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const income = parseFloat(document.getElementById('income').value);
        const currency = currencySelect.value;

        let tax = calculateTax(income);
        let currencySymbol = currency === 'INR' ? '₹' : '$'; // Add more currency symbols if needed

        taxAmountP.textContent = `Estimated Tax: ${currencySymbol}${tax.toFixed(2)}`;
        currencyValueP.textContent = `Income in ${currency}: ${currencySymbol}${income.toFixed(2)}`;
        resultDiv.classList.remove('hidden');
    });

    function calculateTax(income) {
        let tax = 0;
        let prevLimit = 0;

        for (let slab of taxSlabs) {
            if (income > slab.limit) {
                tax += (slab.limit - prevLimit) * slab.rate;
                prevLimit = slab.limit;
            } else {
                tax += (income - prevLimit) * slab.rate;
                break;
            }
        }

        return tax;
    }
});
