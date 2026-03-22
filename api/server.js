const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// 🔥 CONEXÃO COM RETRY REAL
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
      console.log('⏳ Aguardando MySQL iniciar...');
      setTimeout(connectWithRetry, 3000); // tenta de novo
    } else {
      console.log('✅ Conectado ao MySQL!');
      connection.release();
    }
  });
}

connectWithRetry();


// ================= ROTAS CRUD =================

// GET todos usuários
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// GET usuário por ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// POST criar usuário
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

// PUT atualizar usuário
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

// DELETE usuário
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Usuário deletado', id });
  });
});

// ================= START =================

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
