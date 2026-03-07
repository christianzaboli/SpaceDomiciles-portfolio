// backend/utils/generateCertificatePDF.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default function generateCertificatePDF(code, certData) {
  return new Promise((resolve, reject) => {
    const fileName = `${code}.pdf`;
    const outputDir = path.resolve("public/certificates");
    const outputPath = path.join(outputDir, fileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // SFONDO
    const bgPath = path.resolve("public/img/certificate_template/space_certificate.jpg");
    doc.image(bgPath, 0, 0, { width: 595, height: 842 });

    // Font
    doc.font("Helvetica-Bold")
       .fontSize(19)
       .fillColor("#40206B");  // Viola scuro simile all’immagine

    // === COORDINATE PERFETTE ===
    const nameY = 504;
    const stackY = 589;
    const planetY = 638;
    const dateY = 700;

    // === TESTO SOPRA LINEE ===
    // Nome del cliente
    doc.text(certData.customerName.toUpperCase(), 0, nameY, {
      width: 595,
      align: "center",
    });

    // Tipo di stack
    doc.text(certData.stackName.toUpperCase(), 0, stackY, {
      width: 595,
      align: "center",
    });

    // Pianeta
    doc.text(certData.planetName.toUpperCase(), 0, planetY, {
      width: 610,
      align: "center",
    });

    // Data
    doc.text(certData.purchaseDate.toUpperCase(), 0, dateY, {
      width: 480,
      align: "center",
    });

    doc.end();

    stream.on("finish", () => resolve(`/certificates/${fileName}`));
    stream.on("error", reject);
  });
}


// -------------------------------------------
// ⭐ TEST LOCALE (non influisce sul backend)
// -------------------------------------------
if (process.env.CERT_TEST === "1") {
  generateCertificatePDF("TEST-CERT", {
    customerName: "Claudia Sgalippa",
    stackName: "Casa Spaziale",
    planetName: "Marte",
    purchaseDate: new Date().toLocaleDateString("it-IT")
  }).then((p) => console.log("PDF di test creato:", p));
}
