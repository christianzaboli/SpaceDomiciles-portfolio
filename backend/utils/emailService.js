// utils/emailService.js
import nodemailer from "nodemailer";
import fs from "fs";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "laney.veum@ethereal.email",
    pass: "M115EQe2kFUN5JV8kS",
  },
});


// ==========================================================
// EMAIL CLIENTE
// ==========================================================
export async function sendAllCertificatesEmail(to, certificates, orderData, items, invoicePdfUrl = null) {

  let attachments = [];

  // CERTIFICATI
  for (const cert of certificates) {
    const certPath = `public${cert.pdf_url}`;
    if (fs.existsSync(certPath)) {
      attachments.push({
        filename: `${cert.certificate_code}.pdf`,
        path: certPath,
        contentType: "application/pdf",
      });
    }
  }

  // FATTURA
  if (invoicePdfUrl) {
    const invPath = `public${invoicePdfUrl}`;
    if (fs.existsSync(invPath)) {
      attachments.push({
        filename: `Fattura-${orderData.order_id}.pdf`,
        path: invPath,
        contentType: "application/pdf",
      });
    }
  }

  // ITEMS HTML
  const itemsHTML = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.stack_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.planet_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.quantity}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">€${i.price}</td>
      </tr>`
    )
    .join("");

  // CERTIFICATI HTML
  const certsHTML = certificates
    .map(
      (c) => `
        <div style="padding:12px; background:#0b0f2b; border:1px solid #232a60; border-radius:8px; margin-bottom:12px;">
          <p style="margin:0; color:#d0d4ff;">
            🔹 <strong>Certificate Code:</strong> ${c.certificate_code}
          </p>
        </div>`
    )
    .join("");

  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to,
    subject: `🚀 Mission Report — Order #${orderData.order_id}`,
    attachments,
    html: `
    <div style="font-family:Arial, sans-serif; background:#05071a; padding:32px; color:white;">
      <div style="max-width:700px; margin:auto; background:#090b27; border-radius:12px; padding:28px; border:1px solid #1e2260;">

        <h1 style="text-align:center; color:#9bb5ff;">🚀 MISSION REPORT FROM SPACEDOMICILES 🚀</h1>
        <p style="text-align:center; color:#7f8dff;">Order #${orderData.order_id}</p>

        ${
          invoicePdfUrl
            ? `<p style="text-align:center; color:#9bb5ff;">📄 La fattura PDF è allegata a questa email.</p>`
            : `<p style="text-align:center; color:#7f8dff;">ℹ Nessuna fattura richiesta.</p>`
        }

        <h3 style="color:#9bb5ff;">🧾 Order Summary</h3>
        <p style="color:#dfe3ff;">
          📄 <strong>Order ID:</strong> ${orderData.order_id}<br>
          📅 <strong>Date:</strong> ${orderData.date}<br>
          💰 <strong>Total:</strong> €${orderData.total_price}<br>
          ${
            orderData.shipping_cost === 0
              ? `📦 <strong>Shipping:</strong> <span style="color:#9bb5ff">Gratis 🚀</span><br>`
              : `📦 <strong>Shipping:</strong> €${orderData.shipping_cost}<br>`
          }
        </p>

        <h3 style="color:#9bb5ff;">📦 Items Acquistati</h3>
        <table width="100%" style="border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Stack</th>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Pianeta</th>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Qty</th>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Prezzo</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <h3 style="color:#9bb5ff;">🪐 Planetary Certificates</h3>
        ${certsHTML}

        <h3 style="color:#9bb5ff;">📡 Customer Coordinates</h3>
        <p style="color:#dfe3ff;">
          <strong>Shipping:</strong><br>${orderData.shipping_address}<br><br>
          ${
            orderData.wantInvoice
              ? `<strong>Billing:</strong><br>${orderData.billing_address}`
              : `<em style="color:#7f8dff;">(Nessuna fattura richiesta)</em>`
          }
        </p>

        <hr style="border:0; border-top:1px solid #23285c; margin:28px 0;">
        <p style="text-align:center; color:#7f8dff;">🌌 SpaceDomiciles — Explore New Worlds</p>

      </div>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}



// ==========================================================
// EMAIL VENDITORE  —  VERSIONE ESTETICA PERFETTA
// ==========================================================
export async function sendVendorEmail(orderData, items) {

  const itemsHTML = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.stack_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.planet_name}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">${i.quantity}</td>
        <td style="padding:8px; border-bottom:1px solid #2a2d55; color:#dfe3ff;">€${i.price}</td>
      </tr>`
    )
    .join("");

  const mailOptions = {
    from: '"SpaceDomiciles" <laney.veum@ethereal.email>',
    to: "venditore@spacedomiciles.com",
    subject: `📡 SPACEDOMICILES - NEW ORDER — #${orderData.order_id}`,
    html: `
    <div style="font-family:Arial, sans-serif; background:#05071a; padding:32px; color:white;">
      <div style="max-width:700px; margin:auto; background:#090b27; border-radius:12px; padding:28px; border:1px solid #1e2260;">

        <h1 style="text-align:center; color:#9bb5ff;">📡 SPACEDOMICILES - NEW ORDER RECEIVED 📡</h1>

        <p style="color:#dfe3ff;">Un nuovo ordine è stato completato su SpaceDomiciles.</p>

        <h3 style="color:#9bb5ff;">📊 Order Details</h3>
        <p style="color:#dfe3ff;">
          📄 <strong>Order ID:</strong> ${orderData.order_id}<br>
          📅 <strong>Date:</strong> ${orderData.date}<br>
          👤 <strong>Customer:</strong> ${orderData.customer_email}<br>
          💰 <strong>Total:</strong> €${orderData.total_price}
        </p>

        <h3 style="color:#9bb5ff;">📦 Items</h3>
        <table width="100%" style="border-collapse:collapse; margin-top:12px;">
          <thead>
            <tr>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Stack</th>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Pianeta</th>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Qty</th>
              <th style="padding:8px; color:#9bb5ff; text-align:left;">Prezzo</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <hr style="border:0; border-top:1px solid #23285c; margin:28px 0;">
        <p style="text-align:center; color:#7f8dff;">SpaceDomiciles — Admin Panel</p>

      </div>
    </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
