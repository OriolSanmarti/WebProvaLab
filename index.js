const express = require('express');
const path = require('path');
const generatePDF = require('./pdfGenerator'); // Importa la función
const { exec } = require('child_process');

const app = express();

// Configura el middleware para servir archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ruta para manejar la raíz y servir el archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para manejar las sumas
app.post('/calculate', express.json(), (req, res) => {
  const { num1, num2 } = req.body;

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).json({ error: 'Invalid inputs' });
  }

  exec(`wsl ./suma ${num1} ${num2}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error ejecutando el programa: ${error.message}`);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (stderr) {
      console.error(`Error en el programa: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }

    res.json({ result: stdout.trim() });
  });
});

// Ruta para generar el PDF, crida la funció pdfGenerator.js
app.post('/generate-pdf', (req, res) => {
  const { input1, input2, result } = req.body;

  if (!input1 || !input2 || !result) {
    return res.status(400).send('Faltan datos para generar el PDF.');
  }

  // Crea el contenido del PDF
  const content = `${input1}\n${input2}\n${result}`;

  generatePDF(content, (err, filePath) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error generando el PDF');
    }

    res.download(filePath, 'Report.pdf', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al enviar el PDF');
      }
    });
  });
});


// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
