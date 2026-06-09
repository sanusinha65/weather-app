const express = require("express");
const { searchLocations, getCurrentWeather, getForecast } = require("../lib/openWeather");

const router = express.Router();

const VALID_UNITS = new Set(["metric", "imperial", "standard"]);

function parseUnits(raw) {
  return VALID_UNITS.has(raw) ? raw : "metric";
}

function parseCoords(req) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }
  return { lat, lon };
}

// GET /api/locations?q=london&limit=5
router.get("/locations", async (req, res, next) => {
  try {
    const query = (req.query.q || "").trim();
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required." });
    }
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 10);
    const results = await searchLocations(query, limit);
    res.json({ count: results.length, results });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather?lat=51.5&lon=-0.12&units=metric
router.get("/weather", async (req, res, next) => {
  try {
    const coords = parseCoords(req);
    if (!coords) {
      return res.status(400).json({ error: "Valid 'lat' and 'lon' query parameters are required." });
    }
    const data = await getCurrentWeather(coords.lat, coords.lon, parseUnits(req.query.units));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/forecast?lat=51.5&lon=-0.12&units=metric
router.get("/forecast", async (req, res, next) => {
  try {
    const coords = parseCoords(req);
    if (!coords) {
      return res.status(400).json({ error: "Valid 'lat' and 'lon' query parameters are required." });
    }
    const daily = await getForecast(coords.lat, coords.lon, parseUnits(req.query.units));
    res.json({ daily });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
