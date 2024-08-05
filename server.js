const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 5501; // Change to a different port


// Middleware for serving static files from the root directory
app.use(express.static(__dirname));

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dhruv2411!',
    database: 'financial_hub'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submission
app.post('/submit-review', (req, res) => {
    const { name, email, message } = req.body;

    // Basic input validation
    if (!name || !email || !message) {
        console.log('Validation failed: Missing fields');
        return res.status(400).send('All fields are required!');
    }

    // Prepare and sanitize input
    const sql = 'INSERT INTO reviews (name, email, message) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error submitting review');
        }
        res.send('Review submitted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
