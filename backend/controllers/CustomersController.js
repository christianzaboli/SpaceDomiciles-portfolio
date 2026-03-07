import connection from "../data/db.js";

//VALIDAZIONE DATI EMAIL
function isValidEmail(email) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
}

// GET - lista di tutti i clienti
export function index(req, res) {
    const sql = "SELECT * FROM customers";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json(results);
    });
}

// GET - dettaglio di un singolo cliente
export function showSingle(req, res) {
    const sql = "SELECT * FROM customers WHERE id = ?";
    connection.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Customer not found" });

        res.json(results[0]);
    });
}

// POST - crea un nuovo cliente
export function store(req, res) {
    const { email, full_name, billing_address, shipping_address, country, phone } = req.body;

    let errors = [];

    if (!email || !isValidEmail(email)) errors.push("Valid email is required");
    if (!full_name || full_name.length < 3) errors.push("full_name must be at least 3 characters");
    if (!billing_address || billing_address.length < 5) errors.push("billing_address must be at least 5 characters");
    if (!shipping_address || shipping_address.length < 5) errors.push("shipping_address must be at least 5 characters");
    if (!country) errors.push("country is required");
    if (!phone || phone.length < 5) errors.push("phone must be at least 5 characters");

    if (errors.length > 0) return res.status(400).json({ errors });

    const sql = `
        INSERT INTO customers (email, full_name, billing_address, shipping_address, country, phone)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [email, full_name, billing_address, shipping_address, country, phone];

    connection.query(sql, params, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
            message: "Customer created",
            id: result.insertId
        });
    });
}

// PUT - aggiorna un cliente esistente
export function update(req, res) {
    const { email, full_name, billing_address, shipping_address, country, phone } = req.body;

    let errors = [];

    if (!email || !isValidEmail(email)) errors.push("Valid email is required");
    if (!full_name || full_name.length < 3) errors.push("full_name must be at least 3 characters");
    if (!billing_address || billing_address.length < 5) errors.push("billing_address must be at least 5 characters");
    if (!shipping_address || shipping_address.length < 5) errors.push("shipping_address must be at least 5 characters");
    if (!country) errors.push("country is required");
    if (!phone || phone.length < 5) errors.push("phone must be at least 5 characters");

    if (errors.length > 0) return res.status(400).json({ errors });

    const sql = `
        UPDATE customers SET 
        email = ?, full_name = ?, billing_address = ?, shipping_address = ?, country = ?, phone = ?
        WHERE id = ?
    `;

    const params = [email, full_name, billing_address, shipping_address, country, phone, req.params.id];

    connection.query(sql, params, (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Customer updated" });
    });
}

// PATCH - aggiorna parzialmente un cliente esistente
export function patch(req, res) {
    const fields = req.body;

    if (fields.email && !isValidEmail(fields.email)) {
        return res.status(400).json({ error: "Invalid email" });
    }

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) return res.status(400).json({ error: "No fields to update" });

    const sql = `UPDATE customers SET ${keys.map(k => `${k} = ?`).join(", ")} WHERE id = ?`;

    connection.query(sql, [...values, req.params.id], (err) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Customer updated (patch)" });
    });
}

// DELETE - elimina un cliente esistente
export function destroy(req, res) {
    const sql = "DELETE FROM customers WHERE id = ?";
    connection.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });

        res.json({ message: "Customer deleted" });
    });
}