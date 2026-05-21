const fs = require("fs");
const { join, basename } = require("path");
const PDFParser = require("pdf2json");

const ROOT = join(__dirname, "..");
const PDF_DIR = join(ROOT, "Codigo-trabajo.pdf");
const OUTPUT  = join(ROOT, "public", "pdf-context.json");

function extractText(pdfPath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      resolve(pdfParser.getRawTextContent().replace(/\r\n/g, "\n"));
    });
    pdfParser.loadPDF(pdfPath);
  });
}

async function main() {
  const files = fs.readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
    console.error("❌ No se encontraron PDFs en", PDF_DIR);
    process.exit(1);
  }

  const documents = [];

  for (const file of files) {
    const pdfPath = join(PDF_DIR, file);
    console.log(`📄 Procesando: ${file}...`);
    try {
      const text = await extractText(pdfPath);
      documents.push({ name: basename(file, ".pdf"), text });
      console.log(`   ✅ Extraídos ${text.length} caracteres.`);
    } catch (err) {
      console.error(`   ❌ Error procesando ${file}:`, err);
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    documents,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n✅ pdf-context.json guardado en public/ con ${documents.length} documento(s).`);
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
