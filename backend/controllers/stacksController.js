import connection from "../data/db.js";


// VALIDAZIONE DATI
function validateStack(data, partial = false) {
    const errors = [];


    function checkRequired(field, condition, message) {
        if (!partial && condition) errors.push(message);
        if (partial && data[field] !== undefined && condition) errors.push(message);
    }


    checkRequired("id_planet", (!data.id_planet || isNaN(data.id_planet)), "id_planet must be a valid number");
    checkRequired("name", (!data.name || data.name.length < 3), "name must be at least 3 characters");
    checkRequired("price", (data.price === undefined || isNaN(data.price) || data.price <= 0), "price must be a positive number");
    checkRequired("stock", (data.stock === undefined || isNaN(data.stock) || data.stock < 0 || data.stock > 200), "stock must be between 0 and 200");
    checkRequired("slug", (!data.slug || data.slug.length < 3), "slug must be at least 3 characters");
    checkRequired("title", (!data.title || data.title.length < 3), "title must be at least 3 characters");
    checkRequired("description", (!data.description || data.description.length < 3), "description must be at least 3 characters");


    return errors;
}


function checkPlanetExists(id_planet) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM planets WHERE id = ?";
        connection.query(sql, [id_planet], (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0);
        });
    });
}


function checkSlugUnique(slug, excludeId = null) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT id FROM stacks WHERE slug = ?";
        let params = [slug];


        if (excludeId !== null) {
            sql += " AND id != ?";
            params.push(excludeId);
        }


        connection.query(sql, params, (err, result) => {
            if (err) return reject(err);
            resolve(result.length === 0);
        });
    });
}


// INDEX – Lista di tutti gli stacks
export function index(req, res) {
    const sql = "SELECT * FROM stacks";


    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(result);
    });
}


// SHOW – Stack singolo via slug
export function showSingle(req, res) {
    const { slug } = req.params;
    const sql = "SELECT * FROM stacks WHERE slug = ?";


    connection.query(sql, [slug], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length === 0) return res.status(404).json({ error: "Stack not found" });
        res.json(result[0]);
    });
}


// SHOW – Tutti gli stacks di un pianeta
export function showPlanetsStacks(req, res) {
    const { slug } = req.params;


    const sql = `
        SELECT stacks.* 
        FROM stacks
        JOIN planets ON stacks.id_planet = planets.id
        WHERE planets.slug = ?
    `;


    connection.query(sql, [slug], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length === 0) return res.status(404).json({ error: "No stacks found for this planet" });
        res.json(result);
    });
}


// STORE – Creazione nuovo stack
export async function store(req, res) {
    const data = req.body;


    const errors = validateStack(data);
    if (errors.length > 0) return res.status(400).json({ errors });


    try {
        const { id_planet, name, price, stock, slug, title, description } = data;


        const planetExists = await checkPlanetExists(id_planet);
        if (!planetExists) {
            return res.status(400).json({ error: `Planet with id ${id_planet} does not exist` });
        }


        const slugOk = await checkSlugUnique(slug);
        if (!slugOk) return res.status(400).json({ error: `Slug '${slug}' already exists` });


        const sql = `
            INSERT INTO stacks
            (id_planet, name, price, stock, slug, title, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        connection.query(sql, [id_planet, name, price, stock, slug, title, description], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error", details: err.sqlMessage });


            res.status(201).json({
                id: result.insertId,
                message: "Stack created"
            });
        });


    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}


// UPDATE – Aggiornamento completo
export async function update(req, res) {
    const id = req.params.id;
    const data = req.body;


    const errors = validateStack(data);
    if (errors.length > 0) return res.status(400).json({ errors });


    try {
        const planetExists = await checkPlanetExists(data.id_planet);
        if (!planetExists) {
            return res.status(400).json({ error: `Planet with id ${data.id_planet} does not exist` });
        }


        if (data.slug) {
            const slugOk = await checkSlugUnique(data.slug, id);
            if (!slugOk) return res.status(400).json({ error: `Slug '${data.slug}' already exists` });
        }


        const sql = "UPDATE stacks SET ? WHERE id = ?";
        connection.query(sql, [data, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });


            if (result.affectedRows === 0) return res.status(404).json({ error: "Stack not found" });


            res.json({ message: "Stack updated" });
        });


    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}


// PATCH – Aggiornamento parziale
export async function patch(req, res) {
    const id = req.params.id;
    const data = req.body;


    const errors = validateStack(data, true);
    if (errors.length > 0) return res.status(400).json({ errors });


    try {


        if (data.id_planet) {
            const planetExists = await checkPlanetExists(data.id_planet);
            if (!planetExists) {
                return res.status(400).json({ error: `Planet with id ${data.id_planet} does not exist` });
            }
        }


        if (data.slug) {
            const slugOk = await checkSlugUnique(data.slug, id);
            if (!slugOk) return res.status(400).json({ error: `Slug '${data.slug}' already exists` });
        }


        const sql = "UPDATE stacks SET ? WHERE id = ?";
        connection.query(sql, [data, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });


            if (result.affectedRows === 0) return res.status(404).json({ error: "Stack not found" });


            res.json({ message: "Stack partially updated" });
        });


    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}


// DESTROY – elimina uno stack
export function destroy(req, res) {
    const id = req.params.id;


    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });


    const sql = "DELETE FROM stacks WHERE id = ?";


    connection.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });


        if (result.affectedRows === 0) return res.status(404).json({ error: "Stack not found" });


        res.json({ message: "Stack deleted" });
    });
}



// PURCHASE – Decrementa lo stock dopo l'acquisto
export function purchaseStack(req, res) {
    const { id } = req.params;
    const { quantity } = req.body || { quantity: 1 };

    if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Invalid ID or quantity" });
    }

    const sql = "UPDATE stacks SET stock = stock - ? WHERE id = ? AND stock >= ?";

    connection.query(sql, [quantity, id, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: "Stock insufficiente o pacchetto non trovato" });
        }

        // Restituisci il nuovo stock
        const selectSql = "SELECT stock FROM stacks WHERE id = ?";
        connection.query(selectSql, [id], (err, rows) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.json({ 
                success: true, 
                newStock: rows[0].stock,
                message: "Stock aggiornato con successo"
            });
        });
    });
}

