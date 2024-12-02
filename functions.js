document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    const num1 = document.getElementById('input1').value;
    const num2 = document.getElementById('input2').value;

    try {
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num1, num2 }),
      });

      const data = await response.json();

      if (response.ok) {
        // Muestra el resultado
        document.getElementById('result').value = data.result;
      } else {
        console.error('Error:', data.error);
        document.getElementById('result').value = 'Error';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').value = 'Error';
    }
});   


// Funció per enviar la info a NodeJS al clickar el botó de generar PDF i rebre el pdf. Frontend -> functions.js -> index.js -> pdfGenerator.js
document.querySelector('button[type="generatePDF"]').addEventListener('click', async () => {
  // Captura los valores de los inputs
  const input1 = document.querySelector('#input1').value;
  const input2 = document.querySelector('#input2').value;
  const result = document.querySelector('#result').value;

  if (!input1 || !input2 || !result) {
    alert('Por favor, completa todos los campos antes de generar el PDF.');
    return;
  }

  // Prepara el contenido para enviar al servidor
  const content = {
    input1,
    input2,
    result,
  };

  try {
    const response = await fetch('/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Especifica que estás enviando JSON
      },
      body: JSON.stringify(content), // Convierte el objeto en una cadena JSON
    });

    if (response.ok) {
      // Descargar el PDF generado
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Report.pdf';
      link.click();
    } else {
      alert('Error generando el PDF');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un problema al generar el PDF.');
  }
});

