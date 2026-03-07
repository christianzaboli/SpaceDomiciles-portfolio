import connection from "../data/db.js";

// VALIDAZIONE DATI EMAIL
function isValidEmail(email) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
}

// INDEX - lista di tutte le fatture
export function index(req, res) {
    const sql = "SELECT * FROM invoices";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json(results);
    });
}

// SHOW – singola fattura
export function showSingle(req, res) {
    const sql = "SELECT * FROM invoices WHERE id = ?";
    connection.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Invoice not found" });

        res.json(results[0]);
    });
}

// STORE – crea una nuova fattura
export function store(req, res) {
    const {
        customer_id,
        shipping_address,
        total_amount,
        invoice_address,
        invoice_email,
        invoice_date,
        invoice_status
    } = req.body;

    let errors = [];

    if (!customer_id) errors.push("customer_id is required");
    if (total_amount < 0) errors.push("total_amount must be >= 0");
    if (!invoice_email || !isValidEmail(invoice_email)) errors.push("Invalid invoice_email");
    if (!invoice_status || !["pending", "paid", "cancelled"].includes(invoice_status))
        errors.push("Invalid invoice_status");

    if (shipping_address && shipping_address.length < 3)
        errors.push("shipping_address must be at least 3 characters long");

    if (errors.length > 0) return res.status(400).json({ errors });

    const sql = `
        INSERT INTO invoices 
        (customer_id, shipping_address, total_amount, invoice_address, invoice_email, invoice_date, invoice_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        customer_id,
        shipping_address,
        total_amount,
        invoice_address,
        invoice_email,
        invoice_date,
        invoice_status
    ];

    connection.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.status(201).json({
            message: "Invoice created",
            id: result.insertId
        });
    });
}

// PUT – aggiornamento completo fattura
export function update(req, res) {
    const {
        customer_id,
        shipping_address,
        total_amount,
        invoice_address,
        invoice_email,
        invoice_date,
        invoice_status
    } = req.body;

    let errors = [];

    if (!customer_id) errors.push("customer_id is required");
    if (total_amount < 0) errors.push("total_amount must be >= 0");
    if (!invoice_email || !isValidEmail(invoice_email)) errors.push("Invalid invoice_email");
    if (!["pending", "paid", "cancelled"].includes(invoice_status))
        errors.push("Invalid invoice_status");

    if (shipping_address && shipping_address.length < 3)
        errors.push("shipping_address must be at least 3 characters long");

    if (errors.length > 0) return res.status(400).json({ errors });

    const sql = `
        UPDATE invoices SET
        customer_id = ?, shipping_address = ?, total_amount = ?, invoice_address = ?, 
        invoice_email = ?, invoice_date = ?, invoice_status = ?
        WHERE id = ?
    `;

    const params = [
        customer_id,
        shipping_address,
        total_amount,
        invoice_address,
        invoice_email,
        invoice_date,
        invoice_status,
        req.params.id
    ];

    connection.query(sql, params, (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Invoice updated" });
    });
}

// PATCH – aggiornamento parziale fattura
export function patch(req, res) {
    const fields = req.body;

    if (fields.invoice_email && !isValidEmail(fields.invoice_email)) {
        return res.status(400).json({ error: "Invalid invoice_email" });
    }

    if (fields.total_amount < 0) {
        return res.status(400).json({ error: "total_amount must be >= 0" });
    }

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) return res.status(400).json({ error: "No fields to update" });

    const sql = `UPDATE invoices SET ${keys.map(k => `${k} = ?`).join(", ")} WHERE id = ?`;

    connection.query(sql, [...values, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Invoice updated (patch)" });
    });
}

// DELETE – elimina una fattura
export function destroy(req, res) {
    const sql = "DELETE FROM invoices WHERE id = ?";
    connection.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Invoice deleted" });
    });
}