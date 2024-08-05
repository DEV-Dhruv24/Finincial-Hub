document.addEventListener('DOMContentLoaded', () => {
    // Initialize the chart
    const ctx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                'Healthcare', 
                'Miscellaneous', 
                'Utilities', 
                'Transportation',
                'Education', 
                'Savings/Investments', 
                'Entertainment/Dining', 
                'Groceries', 
                'Internet',
                'Phone Bill',
                'Insurance',
                'Subscriptions',
                'Gym Membership'
            ],
            datasets: [{
                label: 'Average Monthly Expense (₹)',
                data: [
                    2000, 
                    2000, 
                    3500, 
                    3500, 
                    6000,
                    3500, 
                    3500, 
                    6500, 
                    1000,
                    800,
                    1500,
                    600,
                    1200
                ],
                borderColor: '#FF5722',
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 6,
                pointBackgroundColor: '#FF5722',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        },
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        borderColor: '#ddd',
                        borderWidth: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: false, 
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 12,
                            family: 'Arial'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#333',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#FF5722',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.raw;
                        }
                    }
                }
            }
        }
    });

    // Form submission handler
    const feedbackForm = document.getElementById('feedback-form');

    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(feedbackForm);

        fetch('/submit-review', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Form submission was successful
                alert('Review submitted successfully');
                window.location.reload(); // Refresh the page
            } else {
                // Handle server errors
                alert('Error submitting review');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting review');
        });
    });
});
