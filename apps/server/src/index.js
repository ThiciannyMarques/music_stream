const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Olá do backend!' });
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
