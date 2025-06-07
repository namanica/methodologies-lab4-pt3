require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { pool } = require("../models/db");

const runMigrations = async () => {
  try {
    const migrationsPath = path.join(__dirname, "../migrations");
    const files = fs.readdirSync(migrationsPath).sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
      console.log(`Running migration: ${file}`);
      await pool.query(sql);
    }

    console.log("All migrations applied");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
};

runMigrations();
