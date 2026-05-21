import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PDF_DIR = join(ROOT, "Codigo-trabajo.pdf");
const OUTPUT  = join(ROOT, "public", "pdf-context.json");

async function extractText(pdfPath) {
  const dataBuffer = readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text.trim();
}

async function main() {
  const files = readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));

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
      console.error(`   ❌ Error procesando ${file}:`, err.message);
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    documents,
  };

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n✅ pdf-context.json guardado en public/ con ${documents.length} documento(s).`);
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
