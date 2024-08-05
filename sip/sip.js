document.getElementById('sip-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get user inputs
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    const years = parseFloat(document.getElementById('years').value);
    const annualReturn = parseFloat(document.getElementById('annual-return').value) / 100;

    // Calculate SIP
    const months = years * 12;
    const monthlyReturn = annualReturn / 12;
    let futureValue = 0;
    let totalInvestment = 0;

    for (let i = 0; i < months; i++) {
        futureValue = (futureValue + monthlyInvestment) * (1 + monthlyReturn);
    }
    totalInvestment = monthlyInvestment * months;
    const totalEarnings = futureValue - totalInvestment;

    // Update results
    document.getElementById('total-investment').textContent = `₹${totalInvestment.toFixed(2)}`;
    document.getElementById('maturity-value').textContent = `₹${futureValue.toFixed(2)}`;
    document.getElementById('total-earnings').textContent = `₹${totalEarnings.toFixed(2)}`;

    // Doughnut Chart Data
    const ctx = document.getElementById('sip-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Investment', 'Total Earnings'],
            datasets: [{
                label: 'Investment Breakdown',
                data: [totalInvestment, totalEarnings],
                backgroundColor: ['#FF5722', '#FFC107'],
                borderColor: ['#FF5722', '#FFC107'],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 16,
                            family: 'Segoe UI'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: ₹${value.toLocaleString()}`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#333',
                    formatter: function(value) {
                        return '₹' + value.toLocaleString();
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
});
document.getElementById('export-button').addEventListener('click', function() {
    const data = {
        totalInvestment: document.getElementById('total-investment').textContent,
        maturityValue: document.getElementById('maturity-value').textContent,
        totalEarnings: document.getElementById('total-earnings').textContent
    };

    const csvContent = `data:text/csv;charset=utf-8,` +
        `Total Investment,Maturity Value,Total Earnings\n` +
        `${data.totalInvestment},${data.maturityValue},${data.totalEarnings}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sip_results.csv');
    document.body.appendChild(link);
    link.click();
});
