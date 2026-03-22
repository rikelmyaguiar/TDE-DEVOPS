const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let db;

function connectWithRetry() {
  db = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123',
    database: process.env.DB_NAME || 'devops_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Aguardando MySQL iniciar...');
      setTimeout(connectWithRetry, 3000);
    } else {
      console.log('Conectado ao MySQL!');
      connection.release();
    }
  });
}

connectWithRetry();


// ================= ROTAS CRUD =================

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// CRIAR USUÁRIO
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, name, email });
    }
  );
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ id, name, email });
    }
  );
});

// DELETAR USUÁRIO
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Usuário deletado', id });
  });
});


app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
