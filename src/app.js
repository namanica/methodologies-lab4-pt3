require("dotenv").config();
const express = require("express");
const forecastRoutes = require("./routes/forecastRoutes");
const { connectDB } = require("./models/db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/weather-app", forecastRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });
