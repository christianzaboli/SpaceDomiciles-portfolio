// backend/utils/generateInvoicePDF.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default function generateInvoicePDF(
  invoiceId,
  billingData,
  orderData,
  itemsDetail
) {
  return new Promise((resolve, reject) => {
    const fileName = `Fattura-${invoiceId}.pdf`;

    const outputDir = path.resolve("public/img/fatture");
    const outputPath = path.join(outputDir, fileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 👉 OFFSET PER AVERE MARGINE SINISTRO DECENTE
    const offsetX = 70;

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // ----------------------------------------------------------
    // HEADER
    // ----------------------------------------------------------
    doc.fontSize(28).fillColor("black").text("SpaceDomiciles", offsetX, 50);

    doc
      .fontSize(20)
      .fillColor("black")
      .text(`FATTURA #${invoiceId}`, -offsetX, 55, { align: "right" });

    doc
      .moveTo(offsetX, 90)
      .lineTo(545, 90)
      .lineWidth(1)
      .strokeColor("black")
      .stroke();

    doc.moveDown(2);

    // ----------------------------------------------------------
    // DATI FATTURAZIONE
    // ----------------------------------------------------------
    doc
      .fontSize(16)
      .fillColor("black")
      .text("DATI DI FATTURAZIONE", offsetX, doc.y, { underline: true });

    doc.moveDown(0.7);
    doc.fontSize(12).fillColor("black");

    doc.text(`${billingData.nome} ${billingData.cognome}`, offsetX);
    doc.text(`Email: ${billingData.email}`, offsetX);
    if (billingData.telefono)
      doc.text(`Telefono: ${billingData.telefono}`, offsetX);
    doc.text(`${billingData.indirizzo} ${billingData.civico}`, offsetX);
    doc.text(
      `${billingData.CAP} ${billingData.città} (${billingData.provincia})`,
      offsetX
    );
    doc.text(billingData.paese, offsetX);

    if (billingData.azienda) {
      doc.moveDown(0.6);
      doc.text(`Azienda: ${billingData.azienda}`, offsetX);
      if (billingData.piva) doc.text(`P.IVA: ${billingData.piva}`, offsetX);
      if (billingData.pec) doc.text(`PEC: ${billingData.pec}`, offsetX);
      if (billingData.sdi) doc.text(`SDI: ${billingData.sdi}`, offsetX);
    }

    doc.moveDown(2);

    // ----------------------------------------------------------
    // DETTAGLIO ORDINE
    // ----------------------------------------------------------
    doc
      .fontSize(16)
      .fillColor("black")
      .text("DETTAGLIO ORDINE", offsetX, doc.y, { underline: true });

    doc.moveDown();

    // 🔢 Calcoliamo il totale dai dettagli, così è SEMPRE coerente
    let grandTotal = 0;

    doc.fontSize(12);
    itemsDetail.forEach((item) => {
      const rowTotal = Number(item.price) * Number(item.quantity);
      grandTotal += rowTotal;

      doc.text(
        `${item.stack_name} — Pianeta ${item.planet_name} ×${item.quantity} — €${rowTotal.toFixed(
          2
        )}`,
        offsetX
      );
      doc.moveDown(0.4);
    });

    doc.moveDown(2);

    // ----------------------------------------------------------
    // TOTALE
    // ----------------------------------------------------------
    doc
      .fontSize(16)
      .fillColor("black")
      .text(`TOTALE: €${grandTotal.toFixed(2)}`, offsetX);

    doc.moveDown(3);

    // ----------------------------------------------------------
    // FOOTER
    // ----------------------------------------------------------
    doc
      .fontSize(10)
      .fillColor("black")
      .text(
        "Grazie per aver scelto SpaceDomiciles — Esplora Nuovi Mondi",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", () => resolve(`/img/fatture/${fileName}`));
    stream.on("error", reject);
  });
}
