import connection from "../data/db.js";

// VALIDAZIONE DATI PIANETA
function validatePlanet(data) {
  const errors = [];

  if (!data.id_galaxy || isNaN(data.id_galaxy)) {
    errors.push("id_galaxy must be a valid number");
  }

  if (!data.name || data.name.length < 3) {
    errors.push("name must be at least 3 characters long");
  }

  if (
    data.planet_size === undefined ||
    isNaN(data.planet_size) ||
    data.planet_size <= 0
  ) {
    errors.push("planet_size must be a positive number");
  }

  if (data.temperature_min === undefined || isNaN(data.temperature_min)) {
    errors.push("temperature_min must be a valid number");
  }

  if (data.temperature_max === undefined || isNaN(data.temperature_max)) {
    errors.push("temperature_max must be a valid number");
  }

  if (Number(data.temperature_min) > Number(data.temperature_max)) {
    errors.push("temperature_min cannot be greater than temperature_max");
  }

  if (
    data.population === undefined ||
    isNaN(data.population) ||
    data.population < 0
  ) {
    errors.push("population must be a positive number");
  }

  if (
    data.surface_available === undefined ||
    isNaN(data.surface_available) ||
    data.surface_available < 0
  ) {
    errors.push("surface_available must be a positive number");
  }

  if (
    data.distance_from_earth === undefined ||
    isNaN(data.distance_from_earth) ||
    data.distance_from_earth < 0
  ) {
    errors.push("distance_from_earth must be a positive number");
  }

  if (!data.slug || data.slug.length < 3) {
    errors.push("slug must be at least 3 characters long");
  }

  if (!data.description || data.description.length < 5) {
    errors.push("description must be at least 5 characters long");
  }

  if (!data.image || data.image.length < 3) {
    errors.push("image must be a valid filename");
  }

  return errors;
}

// INDEX – lista pianeti
export function index(req, res) {
  const sql = `SELECT 
    planets.*, galaxies.slug as galaxy_slug
FROM
    planets
        JOIN
    galaxies ON planets.id_galaxy = galaxies.id`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    results.map((x) => {
      if (x.image && x.image.search("http") === -1) {
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });

    res.json(results);
  });
}

// INDEX – lista pianeti filtrati
export function indexFilter(req, res) {
  // Leggo i filtri dalla query (arrivano come stringhe)
  const {
    search = "",
    temperatureMin = -Infinity,
    temperatureMax = Infinity,
    sizeMin = -Infinity,
    sizeMax = Infinity,
    price = Infinity,
    galaxy_slug = "",
  } = req.query;

  const sql = `SELECT DISTINCT p.*, galaxies.slug as galaxy_slug, galaxies.name as galaxy_name
    FROM planets p
    JOIN stacks s ON s.id_planet = p.id
    JOIN galaxies ON p.id_galaxy = galaxies.id
    WHERE p.name LIKE CONCAT('%', ?, '%')
      AND p.temperature_min >= ? 
      AND p.temperature_max <= ?
      AND p.planet_size BETWEEN ? AND ?
      AND s.price <= ?
      AND galaxies.slug LIKE CONCAT('%', ?, '%')`;

  // ripulisco la stringa search
  function convertSearch(str) {
    str = str.trimStart();
    if (str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Converto i parametri numerici (req.query li porta come stringhe)
  const params = [
    convertSearch(search),
    Number(temperatureMin),
    Number(temperatureMax),
    Number(sizeMin),
    Number(sizeMax),
    Number(price),
    convertSearch(galaxy_slug),
  ];

  console.log(params);

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }
    results.map((x) => {
      if (x.image && x.image.search("http") === -1) {
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });

    res.json(results);
  });
}

// SHOW – pianeta singolo via slug
export function show(req, res) {
  const { slug } = req.params;
  const sql = `SELECT planets.*, galaxies.slug as galaxy_slug, galaxies.name as galaxy_name
    FROM planets 
    JOIN galaxies ON planets.id_galaxy = galaxies.id
    WHERE planets.slug = ?`;

  connection.query(sql, [slug], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) {
      return res.status(404).json({ error: "Planet not found" });
    }

    result.map((x) => {
      if (x.image && x.image.search("http") === -1) {
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });

    res.json(result[0]);
  });
}

// SHOW - Pianeti della galassia
export function showGalaxyPlanet(req, res) {
  const { galaxySlug } = req.params;
  const sql = `SELECT 
    planets.*, galaxies.slug as galaxy_slug
FROM
    planets
        JOIN
    galaxies ON planets.id_galaxy = galaxies.id
    where galaxies.slug = ?`;

  connection.query(sql, [galaxySlug], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) {
      return res.status(404).json({ error: "Planets not found" });
    }

    result.map((x) => {
      if (x.image && x.image.search("http") === -1) {
        x.image = x.image === "" ? null : req.imagePath + x.image;
      }
    });

    res.json(result);
  });
}

// STORE – crea nuovo pianeta
export function store(req, res) {
  const data = req.body;

  const errors = validatePlanet(data);
  if (errors.length > 0) return res.status(400).json({ errors });

  let { image } = data;

  if (image && !image.startsWith("http")) {
    image = req.imagePath + image;
  }

  const sql = `
        INSERT INTO planets
        (id_galaxy, name, planet_size, temperature_min, temperature_max,
         population, surface_available, distance_from_earth, description, image, slug)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  connection.query(
    sql,
    [
      data.id_galaxy,
      data.name,
      data.planet_size,
      data.temperature_min,
      data.temperature_max,
      data.population,
      data.surface_available,
      data.distance_from_earth,
      data.description,
      image,
      data.slug,
    ],
    (err, result) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ error: `Slug '${data.slug}' already exists` });
      }

      if (err) {
        return res.status(500).json({
          error: "Database error",
          details: err.sqlMessage,
        });
      }

      res.status(201).json({ id: result.insertId, message: "Planet created" });
    }
  );
}

// UPDATE – aggiornamento completo
export function update(req, res) {
  const id = req.params.id;
  const data = req.body;

  const errors = validatePlanet(data);
  if (errors.length > 0) return res.status(400).json({ errors });

  if (data.image && !data.image.startsWith("http")) {
    data.image = req.imagePath + data.image;
  }

  connection.query(
    "UPDATE planets SET ? WHERE id = ?",
    [data, id],
    (err, result) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Slug already exists" });
      }

      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Planet not found" });

      res.json({ message: "Planet updated" });
    }
  );
}

// PATCH – aggiornamento parziale
export function patch(req, res) {
  const id = req.params.id;
  const data = req.body;

  const fake = {
    id_galaxy: data.id_galaxy ?? 1,
    name: data.name ?? "aaa",
    planet_size: data.planet_size ?? 1,
    temperature_min: data.temperature_min ?? -200,
    temperature_max: data.temperature_max ?? 200,
    population: data.population ?? 0,
    surface_available: data.surface_available ?? 0,
    distance_from_earth: data.distance_from_earth ?? 0,
    description: data.description ?? "aaaaa",
    image: data.image ?? "img.png",
    slug: data.slug ?? "aaa",
  };

  const errors = validatePlanet(fake);
  if (errors.length > 0) return res.status(400).json({ errors });

  if (data.image && !data.image.startsWith("http")) {
    data.image = req.imagePath + data.image;
  }

  connection.query(
    "UPDATE planets SET ? WHERE id = ?",
    [data, id],
    (err, result) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Slug already exists" });
      }

      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Planet not found" });

      res.json({ message: "Planet partially updated" });
    }
  );
}

// DELETE – elimina pianeta
export function destroy(req, res) {
  const id = req.params.id;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  connection.query("DELETE FROM planets WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Planet not found" });

    res.json({ message: "Planet deleted" });
  });
}
