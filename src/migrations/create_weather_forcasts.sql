CREATE TABLE IF NOT EXISTS weather_forecasts (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255),
  temperature FLOAT,
  forecast TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
