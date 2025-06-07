const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log(pool)

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error", err);
  }
};

module.exports = { pool, connectDB };
