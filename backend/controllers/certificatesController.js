import connection from "../data/db.js";

// UTILITY: genera un codice tipo C-ABC123
function generateCertificateCode() {
    return "C-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

//INDEX - lista di tutti i certificati
export function index(req, res) {
    const sql = "SELECT * FROM certificates";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
}

//SHOW - mostra un singolo certificato
export function show(req, res) {
    const id = req.params.id;

    const sql = "SELECT * FROM certificates WHERE id = ?";
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0)
            return res.status(404).json({ error: "Certificate not found" });

        res.json(results[0]);
    });
}

//STORE - crea un nuovo certificato
export function store(req, res) {
    const { stack_invoices_id } = req.body;

    if (!stack_invoices_id)
        return res.status(400).json({ error: "stack_invoices_id is required" });

    const certificate_code = generateCertificateCode();
    const issued_at = new Date();
    const pdf_url = `/certificates/${certificate_code}.pdf`;

    const sqlCheck = "SELECT * FROM invoices_stack WHERE id = ?";

    connection.query(sqlCheck, [stack_invoices_id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0)
            return res.status(400).json({ error: "Invalid stack_invoices_id" });

        const sqlInsert = `
            INSERT INTO certificates 
                (stack_invoices_id, certificate_code, issued_at, pdf_url)
            VALUES (?, ?, ?, ?)
        `;

        const params = [
            stack_invoices_id,
            certificate_code,
            issued_at,
            pdf_url
        ];

        connection.query(sqlInsert, params, (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.status(201).json({
                id: result.insertId,
                stack_invoices_id,
                certificate_code,
                issued_at,
                pdf_url
            });
        });
    });
}

// PUT - modifica completa del certificato
export function update(req, res) {
    const id = req.params.id;
    const { stack_invoices_id, pdf_url } = req.body;

    if (!stack_invoices_id || !pdf_url) {
        return res.status(400).json({ error: "stack_invoices_id and pdf_url are required" });
    }

    const sql = `
        UPDATE certificates
        SET stack_invoices_id = ?, pdf_url = ?
        WHERE id = ?
    `;

    connection.query(sql, [stack_invoices_id, pdf_url, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Certificate not found" });

        res.json({
            id,
            stack_invoices_id,
            pdf_url
        });
    });
}

//PATCH - modifica parziale del certificato
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
        UPDATE certificates
        SET ${setClauses.join(", ")}
        WHERE id = ?
    `;

    connection.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Certificate not found" });

        res.json({ message: "Certificate updated", updated: fields });
    });
}

// DELETE — rimuovi il certificato
export function destroy(req, res) {
    const id = req.params.id;

    const sql = "DELETE FROM certificates WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Certificate not found" });

        res.json({ message: "Certificate deleted" });
    });
}