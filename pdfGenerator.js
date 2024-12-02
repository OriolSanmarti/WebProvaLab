const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const { createCanvas } = require('canvas');
const katex = require('katex');

function generatePDF(content, callback) {
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, 'output2.pdf');
  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);
  
 // **PORTADA DEL PDF**
  // Inserta los logotipos
  const logo1Path = path.join(__dirname, 'logo1.png');
  const logo2Path = path.join(__dirname, 'logo2.png');
  doc.image(logo1Path, 50, 50, { width: 150 }); // Logo 1 (izquierda)
  doc.image(logo2Path, 400, 50, { width: 150 }); // Logo 2 (derecha)
  doc.text(' ', { align: 'center', lineGap: 80 });
  // Título principal
  doc
    .fontSize(24)
    .font('Times-Roman')
    .text('Technical Report. Final version', { align: 'center', lineGap: 20 });

  // Subtítulo
  doc
    .fontSize(16)
    .font('Helvetica')
    .text(
      'Calculations and simulations for an impressive two integer sumation',
      { align: 'center', lineGap: 10 }
    );

  // Fecha
  doc
    .fontSize(12)
    .font('Helvetica-Oblique')
    .text('Version date: 02nd Decembre 2024', { align: 'center', lineGap: 20 });

  // Nota
  doc
    .fontSize(10)
    .font('Helvetica')
    .text(
      'This version extends the one delivered in January by introducing six new cases.',
      { align: 'center', lineGap: 30 }
    );

  // Línea horizontal
  doc
    .moveTo(50, 400) // Punto inicial
    .lineTo(550, 400) // Punto final
    .stroke();

  // **CONTENIDO PRINCIPAL**
  // Salta a la siguiente página
  doc.addPage();
  // Introducir título de sección
  addSectionTitle(doc, '1', 'Introduction');
  // Introduction content
  doc
    .font('Helvetica') // Normal font for the content
    .fontSize(12) // Standard font size
    .text(
      'Welcome to SimpleSum, a sleek and efficient web app designed to simplify your calculations. This platform takes two integers as input and instantly returns their sum. Whether you need quick results for basic arithmetic or a tool to double-check your math, SimpleSum is here to make the process effortless.',
      { align: 'justify' }
    )
    .moveDown(1);

  // Introducir título de subsección
  addSubsectionTitle(doc, '1.1', 'How it works');
  // Steps for How It Works
  doc
    .font('Helvetica')
    .fontSize(12)
    .text('    1. Enter two integers in the provided input fields.', { align: 'left' })
    .text('    2. Click the "Calculate" button.', { align: 'left' })
    .text('    3. Instantly view the result displayed below.', { align: 'left' })
    .text('The formula used is the following:')
    .fontSize(14).text('a + b = c', { align: 'center' })
    .moveDown(1);
  
  addSubsectionTitle(doc, '1.2', 'Why Choose SimpleSum?');
  // Points for Why Choose SimpleSum
  doc
    .font('Helvetica')
    .fontSize(12)
    .text('- Ease of Use: A straightforward interface that anyone can navigate.', { align: 'left' })
    .text('- Speed: Results are calculated and displayed instantly.', { align: 'left' })
    .text('- Accurate: Built with robust programming to ensure reliable outcomes.', { align: 'left' })
    .moveDown(1);

  // Resultats finals
  addSectionTitle(doc, '2', 'Final results');
  
  // Divide el contenido por saltos de línea
  const lines = content.split('\n');
  const input1 = lines[0]; // Primera línea (Input 1)
  const input2 = lines[1]; // Segunda línea (Input 2)
  const result = lines[2]; // Tercera línea (Resultado)

  doc
    .font('Helvetica') // Contenido normal
    .fontSize(12)
    .text(`    First introduced input: ${input1}`, { align: 'left', lineGap: 6 }) // Input 1
    .text(`    Second introduced input: ${input2}`, { align: 'left', lineGap: 6 }) // Input 2
    .moveDown(1);

  doc
  .fillColor('green')
  .text(`    Final result after calculations: ${result}`, { align: 'left', lineGap: 6 })
  .fillColor('black'); // Resultado

  // Add footer
  addFooter(
    doc,
    'Preliminary study for two integer sum calculation', // Left-aligned text
    '',           // Centered text
    1                                         // Page number
  );

  doc.end();
  

  writeStream.on('finish', () => {
    callback(null, filePath);
  });

  writeStream.on('error', (err) => {
    callback(err, null);
  });
}

module.exports = generatePDF;


function addFooter(doc, textLeft, textCenter, pageNumber) {
  const footerHeight = 40; // Adjust footer height if needed

  // Set position for the footer
  const pageHeight = doc.page.height;
  const footerY = pageHeight - footerHeight;

  
  // Draw a horizontal line above the footer
  doc
    .moveTo(50, footerY - 60)
    .lineTo(doc.page.width - 50, footerY - 60)
    .stroke();
  
  // Add left-aligned text
  doc
    .fontSize(12)
    .text(textLeft, 50, footerY - 50, {
      width: 400,
      align: 'left',
    });

  /*
  // Add centered text
  doc
    .fontSize(12)
    .text(textCenter, doc.page.width / 2 - 100, footerY - 5, {
      width: 200,
      align: 'center',
    });
  */
  // Add right-aligned page number
  doc
    .fontSize(12)
    .text(`Page ${pageNumber}`, doc.page.width - 100, footerY - 50, {
      width: 50,
      align: 'right',
    });
}

function addSectionTitle(doc, sectionNumber, sectionTitle) {
  // Formato para el título de la sección
  doc
    .font('Helvetica-Bold') // Fuente en negrita
    .fontSize(14) // Tamaño del título principal
    .text(`${sectionNumber}.  ${sectionTitle}`, { continued: false, align: 'left' })
    .moveDown(0.5); // Espaciado después del título
}

function addSubsectionTitle(doc, subsectionNumber, subsectionTitle) {
  // Formato para el título de la subsección
  doc
    .font('Helvetica-Bold') // Fuente en negrita
    .fontSize(12) // Tamaño del subtítulo
    .text(`${subsectionNumber}.  ${subsectionTitle}`, { continued: false, align: 'left' })
    .moveDown(0.5); // Espaciado después del subtítulo
}
