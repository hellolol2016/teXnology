import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { HtmlGenerator } from 'latex.js';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const LatexToPDF = () => {
  const [latexInput, setLatexInput] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const compileLatexToPdf = async () => {
    try {
      // Compile LaTeX to HTML using latex.js
      const generator = new HtmlGenerator({ hyphenate: false });
      const doc = generator.parse(latexInput);
      const htmlContent = generator.toMarkup();

      // Create a PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      // Simple example: draw HTML content as text (better HTML-to-PDF rendering requires more advanced handling)
      page.drawText(htmlContent, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      });

      // Serialize the PDF document to bytes
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error('Error compiling LaTeX to PDF:', error);
    }
  };
   return (
    <div>
      <textarea
        rows="10"
        cols="50"
        value={latexInput}
        onChange={(e) => setLatexInput(e.target.value)}
        placeholder="Enter LaTeX here"
      />
      <button onClick={compileLatexToPdf}>Compile to PDF</button>
      {pdfUrl && (
        <>
          <div style={{ height: '500px', width: '100%' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}>
              <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </div>
        </>
      )}
    </div>
  );
};

export default LatexToPDF;