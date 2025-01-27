const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const path = require('path');

oracledb.initOracleClient({ libDir: 'C:\\instantclient_19_25' });

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'frontend', 'public')));
app.use(bodyParser.json());

const dbConfig = {
  user: 'system',
  password: 'Sricharan@3112004',
  connectString: 'localhost/XE'
};

// Login
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM users WHERE username = :username AND password = :password AND role = :role`,
      [username, password, role]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, role });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

// Signup
app.post('/api/signup', async (req, res) => {
  const { username, password, role } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO users (username, password, role) VALUES (:username, :password, :role)`,
      [username, password, role],
      { autoCommit: true }
    );
    res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM employees`);
    res.json(result.rows.map(row => ({
      id: row[0],
      name: row[1],
      position: row[2],
      salary: row[3]
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

// Add an employee
app.post('/api/employees', async (req, res) => {
  const { id, name, position, salary } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO employees (id, name, position, salary) VALUES (:id, :name, :position, :salary)`,
      [id, name, position, salary],
      { autoCommit: true }
    );
    res.json({ id, name, position, salary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

// Update an employee
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE employees SET name = :name, position = :position, salary = :salary WHERE id = :id`,
      [name, position, salary, id],
      { autoCommit: true }
    );
    res.json({ id, name, position, salary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

// Delete an employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `DELETE FROM employees WHERE id = :id`,
      [id],
      { autoCommit: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    if (connection) await connection.close();
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
