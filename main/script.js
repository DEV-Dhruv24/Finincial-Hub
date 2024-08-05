// Select DOM elements
const transactionForm = document.getElementById('transaction-form');
const transactionTableBody = document.getElementById('transaction-table').getElementsByTagName('tbody')[0];
const incomeAmountElement = document.getElementById('income-amount');
const expenseAmountElement = document.getElementById('expense-amount');
const balanceAmountElement = document.getElementById('balance-amount');
const downloadButton = document.getElementById('download-transactions');
const notificationSection = document.getElementById('notification');
const notificationList = document.getElementById('notification-list');

// Initialize transaction data array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Handle form submission
transactionForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value).toFixed(2);
    const category = document.getElementById('category').value || 'Uncategorized';
    const date = new Date().toLocaleDateString();

    transactions.push({ type, amount, date, category });

    updateTransactionTable(); // Update the table with new transaction
    updateSummary(); // Update the summary with new transaction

    showNotification(`Transaction added: ${type} - ₹${amount} - ${category}`); // Show notification

    transactionForm.reset(); // Clear form inputs

    localStorage.setItem('transactions', JSON.stringify(transactions)); // Save to local storage
});

// Update the transaction table
function updateTransactionTable() {
    transactionTableBody.innerHTML = ''; // Clear the table body

    transactions.forEach((transaction, index) => {
        const row = transactionTableBody.insertRow();
        row.insertCell(0).textContent = transaction.date;
        row.insertCell(1).textContent = transaction.type;
        row.insertCell(2).textContent = `₹${transaction.amount}`;
        row.insertCell(3).textContent = transaction.category;

        const deleteCell = row.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteTransaction(index));
        deleteCell.appendChild(deleteButton);
    });
}

// Handle transaction deletion
function deleteTransaction(index) {
    transactions.splice(index, 1); // Remove the transaction from the array

    updateTransactionTable(); // Update the table after deletion
    updateSummary(); // Update the summary after deletion

    showNotification('Transaction deleted.'); // Show notification

    localStorage.setItem('transactions', JSON.stringify(transactions)); // Update local storage
}

// Update the summary section
function updateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += parseFloat(transaction.amount);
        } else if (transaction.type === 'expense') {
            totalExpense += parseFloat(transaction.amount);
        }
    });

    incomeAmountElement.textContent = totalIncome.toFixed(2);
    expenseAmountElement.textContent = totalExpense.toFixed(2);
    balanceAmountElement.textContent = (totalIncome - totalExpense).toFixed(2);
}

// Show notification
function showNotification(message) {
    notificationSection.style.display = 'block'; // Ensure notification section is visible
    notificationList.innerHTML = ''; // Clear previous notifications

    const listItem = document.createElement('li');
    listItem.textContent = message;
    notificationList.appendChild(listItem);

    setTimeout(() => {
        notificationList.removeChild(listItem); // Remove notification after 2 seconds
        if (notificationList.children.length === 0) {
            notificationSection.style.display = 'none'; // Hide notification section if empty
        }
    }, 2000);
}

// Download transactions as CSV
downloadButton.addEventListener('click', function() {
    let csvContent = 'Date,Type,Amount,Category\n'; // CSV header

    transactions.forEach(transaction => {
        csvContent += `${transaction.date},${transaction.type},${transaction.amount},${transaction.category}\n`;
    });

    csvContent += `\nTotal Income,,${parseFloat(incomeAmountElement.textContent).toFixed(2)},\n`;
    csvContent += `Total Expense,,${parseFloat(expenseAmountElement.textContent).toFixed(2)},\n`;
    csvContent += `Balance,,${parseFloat(balanceAmountElement.textContent).toFixed(2)},\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// Load existing transactions from local storage on page load
window.addEventListener('load', () => {
    if (transactions.length > 0) {
        updateTransactionTable();
        updateSummary();
    }
});
