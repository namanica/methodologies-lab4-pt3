const express = require("express");
const router = express.Router();
const { pool } = require("../models/db");

//create weather forecast
router.post("/forecast", async (req, res) => {
  const { city, temperature, forecast } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO weather_forecasts (city, temperature, forecast) VALUES ($1, $2, $3) RETURNING *",
      [city, temperature, forecast]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Failed to insert weather data" });
  }
});

//get all weather forecasts
router.get("/forecasts", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM weather_forecasts ORDER BY timestamp DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

//get weather forecast by city
router.get("/forecast/:city", async (req, res) => {
  const city = req.params.city;
  try {
    const result = await pool.query(
      "SELECT * FROM weather_forecasts WHERE LOWER(city) = LOWER($1) ORDER BY timestamp DESC",
      [city]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch by city error:", err);
    res.status(500).json({ error: "Failed to fetch weather data for city" });
  }
});

//edit weather forecast by id
router.put("/forecast/:id", async (req, res) => {
  const id = req.params.id;
  const fields = [];
  const values = [];
  let idx = 1;

  // Перебираем возможные поля и добавляем, если есть в теле запроса
  if (req.body.city !== undefined) {
    fields.push(`city = $${idx++}`);
    values.push(req.body.city);
  }
  if (req.body.temperature !== undefined) {
    fields.push(`temperature = $${idx++}`);
    values.push(req.body.temperature);
  }
  if (req.body.forecast !== undefined) {
    fields.push(`forecast = $${idx++}`);
    values.push(req.body.forecast);
  }

  // Если нет полей для обновления
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  // Обновляем timestamp всегда
  fields.push(`timestamp = CURRENT_TIMESTAMP`);

  try {
    const query = `
      UPDATE weather_forecasts
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Weather record not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update weather data" });
  }
});

//delete weather forecast by id
router.delete("/forecast/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM weather_forecasts WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete weather data" });
  }
});

module.exports = router;
