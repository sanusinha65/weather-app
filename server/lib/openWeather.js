const axios = require("axios");
const cache = require("./cache");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

function getApiKey() {
  const key = process.env.WEATHER_API_KEY;
  if (!key) {
    throw Object.assign(new Error("WEATHER_API_KEY is not configured on the server."), {
      status: 500,
    });
  }
  return key;
}

/**
 * Wraps an axios GET with in-memory caching keyed by the full request.
 * Upstream errors are normalised into an Error carrying an HTTP `status`.
 */
async function cachedGet(cacheKey, url, params) {
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await axios.get(url, { params, timeout: 10000 });
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    const status = err.response?.status || 502;
    const message =
      err.response?.data?.message || err.message || "Upstream weather service error.";
    throw Object.assign(new Error(message), { status });
  }
}

/**
 * Searches for matching locations by name. Returns up to `limit` results
 * with coordinates, suitable for a search-as-you-type box.
 */
async function searchLocations(query, limit = 5) {
  const appid = getApiKey();
  const key = `geo:${query}:${limit}`;
  const results = await cachedGet(key, `${GEO_URL}/direct`, {
    q: query,
    limit,
    appid,
  });

  return results.map((loc) => ({
    name: loc.name,
    state: loc.state || null,
    country: loc.country,
    lat: loc.lat,
    lon: loc.lon,
  }));
}

/**
 * Current weather for a coordinate. `units` is "metric" or "imperial".
 */
async function getCurrentWeather(lat, lon, units = "metric") {
  const appid = getApiKey();
  const key = `weather:${lat}:${lon}:${units}`;
  return cachedGet(key, `${BASE_URL}/weather`, { lat, lon, appid, units });
}

/**
 * 5-day / 3-hour forecast for a coordinate, condensed into one entry per day
 * (min/max temp, representative icon, wind, humidity).
 */
async function getForecast(lat, lon, units = "metric") {
  const appid = getApiKey();
  const key = `forecast:${lat}:${lon}:${units}`;
  const data = await cachedGet(key, `${BASE_URL}/forecast`, { lat, lon, appid, units });
  return summariseDailyForecast(data);
}

function summariseDailyForecast(data) {
  const byDay = new Map();

  for (const entry of data.list || []) {
    const dayKey = entry.dt_txt ? entry.dt_txt.split(" ")[0] : null;
    if (!dayKey) continue;

    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, {
        dt: entry.dt,
        temp: { min: entry.main.temp_min, max: entry.main.temp_max },
        weather: entry.weather,
        wind_speed: entry.wind?.speed ?? 0,
        humidity: entry.main.humidity,
        _noonDiff: Infinity,
      });
      continue;
    }

    const day = byDay.get(dayKey);
    day.temp.min = Math.min(day.temp.min, entry.main.temp_min);
    day.temp.max = Math.max(day.temp.max, entry.main.temp_max);

    // Prefer the reading closest to local noon for the representative icon/description.
    const hour = Number((entry.dt_txt.split(" ")[1] || "00").slice(0, 2));
    const noonDiff = Math.abs(12 - hour);
    if (noonDiff < day._noonDiff) {
      day._noonDiff = noonDiff;
      day.weather = entry.weather;
      day.wind_speed = entry.wind?.speed ?? day.wind_speed;
      day.humidity = entry.main.humidity;
    }
  }

  return Array.from(byDay.values()).map(({ _noonDiff, ...day }) => day);
}

module.exports = { searchLocations, getCurrentWeather, getForecast };
