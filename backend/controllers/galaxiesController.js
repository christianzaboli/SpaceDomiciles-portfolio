import connection from "../data/db.js";

// INDEX - lista di tutte le galassie
export function index(req, res) {
  const sql = "SELECT * FROM galaxies";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
}

// SHOW – singola galassia
export function showSingle(req, res) {
  const sql = "SELECT * FROM galaxies WHERE slug = ?";
  connection.query(sql, [req.params.slug], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(404).json({ error: "Galaxy not found" });
    res.json(results[0]);
  });
}

// STORE – crea una nuova galassia
export function store(req, res) {
  const { name, description } = req.body;
  let errors = [];

  if (!name || name.length < 2)
    errors.push("name must be at least 2 characters long");
  if (!description || description.length < 5)
    errors.push("description must be at least 5 characters long");

  if (errors.length > 0) return res.status(400).json({ errors });

  const sql = "INSERT INTO galaxies (name, description) VALUES (?, ?)";
  connection.query(sql, [name, description], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res.status(400).json({ error: "Galaxy name must be unique" });

      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "Galaxy created", id: result.insertId });
  });
}

// PUt - aggiornamento completo galassia
export function update(req, res) {
  const { name, description } = req.body;
  let errors = [];

  if (!name || name.length < 2)
    errors.push("name must be at least 2 characters long");
  if (!description || description.length < 5)
    errors.push("description must be at least 5 characters long");

  if (errors.length > 0) return res.status(400).json({ errors });

  const sql = `
        UPDATE galaxies 
        SET name = ?, description = ?
        WHERE id = ?
    `;

  connection.query(sql, [name, description, req.params.id], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res.status(400).json({ error: "Galaxy name must be unique" });

      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Galaxy updated" });
  });
}

// PATCH – aggiornamento parziale galassia
export function patch(req, res) {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (keys.length === 0)
    return res.status(400).json({ error: "No fields to update" });

  const sql = `UPDATE galaxies SET ${keys
    .map((k) => `${k} = ?`)
    .join(", ")} WHERE id = ?`;

  connection.query(sql, [...Object.values(fields), req.params.id], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY")
        return res.status(400).json({ error: "Galaxy name must be unique" });

      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Galaxy updated (patch)" });
  });
}

// DELETE – elimina una galassia
export function destroy(req, res) {
  const sql = "DELETE FROM galaxies WHERE id = ?";
  connection.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Galaxy deleted" });
  });
}
