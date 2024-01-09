const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'routing'
})



app.post('/register', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    db.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)',
    [firstName, lastName, email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error during registration");
        } else {
            res.status(200).send("User registered successfully");
        }
    });
});

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
