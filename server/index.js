require("dotenv").config();

const express = require("express");
const cors = require("cors");
const weatherRoutes = require("./routes/weather");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api", weatherRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Centralised error handler: routes call next(err) and land here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error("[server error]", err);
  }
  res.status(status).json({ error: err.message || "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Weather backend listening on http://localhost:${PORT}`);
  if (!process.env.WEATHER_API_KEY) {
    console.warn("WARNING: WEATHER_API_KEY is not set. Copy .env.example to .env and add your key.");
  }
});

module.exports = app;
