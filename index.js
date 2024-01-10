const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'routing'
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)',
      [firstName, lastName, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error during registration');
        } else {
          res.status(200).send('User registered successfully');
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during registration');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length > 0) {
      const storedPassword = result[0].password;
      const passwordMatch = await bcrypt.compare(password, storedPassword);

      if (passwordMatch) {
        // User found, login successful
        res.status(200).send('Login successful');
      } else {
        // Passwords do not match
        res.status(401).send('Invalid email or password');
      }
    } else {
      // No user found with the provided email
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login');
  }
});

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
