import connection from "../data/db.js";

// INDEX – lista di tutti i record
export function index(req, res) {
    const sql = "SELECT * FROM invoices_stack";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
}

// SHOW – mostra un singolo record
export function show(req, res) {
    const sql = "SELECT * FROM invoices_stack WHERE id = ?";
    connection.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0)
            return res.status(404).json({ error: "Record not found" });

        res.json(results[0]);
    });
}

// STORE – crea un nuovo record
export function store(req, res) {
    const { invoice_id, stack_id, price, quantity } = req.body;

    const sql = `
        INSERT INTO invoices_stack (invoice_id, stack_id, price, quantity)
        VALUES (?, ?, ?, ?)
    `;

    const params = [invoice_id, stack_id, price, quantity];

    connection.query(sql, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
            id: result.insertId,
            invoice_id,
            stack_id,
            price,
            quantity
        });
    });
}

// PUT - aggiornamento completo dei record
export function update(req, res) {
    const id = req.params.id;
    const { invoice_id, stack_id, price, quantity } = req.body;

    const sql = `
        UPDATE invoices_stack
        SET invoice_id = ?, stack_id = ?, price = ?, quantity = ?
        WHERE id = ?
    `;

    connection.query(sql, [invoice_id, stack_id, price, quantity, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Record not found" });

        res.json({
            id,
            invoice_id,
            stack_id,
            price,
            quantity
        });
    });
}

// PATCH – modifica parziale dei record
export function modify(req, res) {
    const id = req.params.id;
    const fields = req.body;

    const keys = Object.keys(fields);

    if (keys.length === 0)
        return res.status(400).json({ error: "No fields to update" });

    const setClauses = keys.map(key => `${key} = ?`);
    const values = keys.map(key => fields[key]);
    values.push(id);

    const sql = `
        UPDATE invoices_stack
        SET ${setClauses.join(", ")}
        WHERE id = ?
    `;

    connection.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Record not found" });

        res.json({ message: "Record updated", updated: fields });
    });
}

// DELETE - elimina il record
export function destroy(req, res) {
    const sql = "DELETE FROM invoices_stack WHERE id = ?";
    connection.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Record not found" });

        res.json({ message: "Record deleted" });
    });
}