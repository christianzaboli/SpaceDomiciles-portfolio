import connection from "../data/db.js";

// VALIDAZIONE DATI
function validatePayment(data) {
    const errors = [];

    if (!data.invoice_id || isNaN(data.invoice_id)) {
        errors.push("invoice_id must be a valid number");
    }

    if (data.amount === undefined || isNaN(data.amount) || Number(data.amount) <= 0) {
        errors.push("amount must be a positive number");
    }

    const validMethods = ["credit_card", "paypal", "crypto"];
    if (!data.method || !validMethods.includes(data.method)) {
        errors.push(`method must be one of: ${validMethods.join(", ")}`);
    }

    const validStatus = ["pending", "completed", "failed"];
    if (!data.status || !validStatus.includes(data.status)) {
        errors.push(`status must be one of: ${validStatus.join(", ")}`);
    }

    if (data.paid_at && isNaN(Date.parse(data.paid_at))) {
        errors.push("paid_at must be a valid date or null");
    }

    return errors;
}

// INDEX – lista di tutti i pagamenti
export function index(req, res) {
    const sql = "SELECT * FROM payments";

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json(results);
    });
}

// SHOW – mostra un singolo pagamento
export function showSingle(req, res) {
    const { id } = req.params;

    const sql = "SELECT * FROM payments WHERE id = ?";

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json(results[0]);
    });
}

// STORE – crea un nuovo pagamento
export function store(req, res) {
    const data = req.body;

    const errors = validatePayment(data);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const sql = `
        INSERT INTO payments (invoice_id, amount, method, status, paid_at)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            data.invoice_id,
            data.amount,
            data.method,
            data.status,
            data.paid_at || null,
        ],
        (err, result) => {
            if (err) {

                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        error: `invoice_id ${data.invoice_id} does not exist`,
                    });
                }

                return res.status(500).json({
                    error: "Database error",
                    details: err.sqlMessage,
                });
            }

            res.status(201).json({
                id: result.insertId,
                message: "Payment created",
            });
        }
    );
}

// UPDATE – aggiornamento completo
export function update(req, res) {
    const { id } = req.params;
    const data = req.body;

    const errors = validatePayment(data);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const sql = "UPDATE payments SET ? WHERE id = ?";

    connection.query(sql, [data, id], (err, result) => {
        if (err) {
            if (err.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    error: `invoice_id ${data.invoice_id} does not exist`,
                });
            }

            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json({ message: "Payment updated" });
    });
}

// PATCH – aggiornamento parziale
export function patch(req, res) {
    const { id } = req.params;
    const data = req.body;

    const fakeFullObject = {
        invoice_id: data.invoice_id ?? 1,
        amount: data.amount ?? 1,
        method: data.method ?? "credit_card",
        status: data.status ?? "pending",
        paid_at: data.paid_at ?? null,
    };

    const errors = validatePayment(fakeFullObject);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const sql = "UPDATE payments SET ? WHERE id = ?";

    connection.query(sql, [data, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json({ message: "Payment partially updated" });
    });
}

// DESTROY – elimina un pagamento
export function destroy(req, res) {
    const { id } = req.params;

    const sql = "DELETE FROM payments WHERE id = ?";

    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.json({ message: "Payment deleted" });
    });
}