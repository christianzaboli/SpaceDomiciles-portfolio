import express from "express";
import connection from "../data/db.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { full_name, email, shipping_address, invoice_address, total_amount } = req.body;

    if (!full_name || !email || !shipping_address || !invoice_address || !total_amount)
        return res.status(400).json({ error: "Dati mancanti per creare una invoice" });

    const sql = `
        INSERT INTO invoices (customer_id, shipping_address, total_amount, invoice_address, invoice_email, invoice_date, invoice_status)
        VALUES (1, ?, ?, ?, ?, NOW(), 'pending')
    `;

    connection.query(
        sql,
        [shipping_address, total_amount, invoice_address, email],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Errore DB", details: err });
            }

            res.json({ success: true, invoice_id: result.insertId });
        }
    );
});

export default router;
