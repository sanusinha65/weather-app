// Weather data access layer.
//
// Every network call to OpenWeather lives here. Components and hooks consume
// *normalized* objects from this module and never talk to axios or know the
// shape of the raw API responses. That separation means a future API swap only
// touches this file.
//
// This replaces the previous broken implementation, which referenced an
// undefined `BASE_URL` (it had been commented out) and therefore threw on the
// very first request.

import axios from "axios";
import { API_KEY, ENDPOINTS, DEFAULT_UNITS, MAX_SUGGESTIONS } from "../constants";

/**
 * A single axios instance lets us attach shared config (timeout, the API key)
 * in one place instead of repeating params on every call.
 */
const client = axios.create({ timeout: 10_000 });

/**
 * Guard used by every public function so we fail fast with a clear message
 * rather than firing a request that is guaranteed to 401.
 */
const assertConfigured = () => {
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Set REACT_APP_WEATHER_API_KEY in your .env file."
    );
  }
};

/**
 * Shared query params for the data endpoints.
 */
const baseParams = (units) => ({ appid: API_KEY, units: units || DEFAULT_UNITS });

// ---------------------------------------------------------------------------
// Normalizers: raw OpenWeather payloads -> flat, UI-friendly shapes.
// ---------------------------------------------------------------------------

/**
 * Normalize the `/weather` response into a flat object the UI can render
 * directly, with no deep property access scattered across components.
 */
export const normalizeCurrentWeather = (raw) => {
  if (!raw) return null;
  const condition = (raw.weather && raw.weather[0]) || {};
  return {
    city: raw.name,
    country: raw.sys && raw.sys.country,
    coord: raw.coord,
    description: condition.description || "",
    icon: condition.icon || "",
    temp: raw.main && raw.main.temp,
    feelsLike: raw.main && raw.main.feels_like,
    tempMin: raw.main && raw.main.temp_min,
    tempMax: raw.main && raw.main.temp_max,
    pressure: raw.main && raw.main.pressure,
    humidity: raw.main && raw.main.humidity,
    visibility: raw.visibility,
    windSpeed: raw.wind && raw.wind.speed,
    cloudiness: raw.clouds && raw.clouds.all,
    timestamp: raw.dt,
  };
};

/**
 * Normalize a single geocoding result.
 */
const normalizeLocation = (raw) => ({
  id: `${raw.lat},${raw.lon}`,
  name: raw.name,
  state: raw.state,
  country: raw.country,
  lat: raw.lat,
  lon: raw.lon,
});

/**
 * The free `/forecast` endpoint returns 3-hour steps for ~5 days. We bucket
 * those steps by calendar day and reduce each bucket to a daily summary so the
 * forecast UI can show one card per day. (The old code called the deprecated
 * `/onecall` endpoint, which no longer works on free keys.)
 */
export const aggregateDailyForecast = (list = []) => {
  const byDay = new Map();

  for (const step of list) {
    const dayKey = new Date(step.dt * 1000).toISOString().slice(0, 10);
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, {
        dt: step.dt,
        temps: [],
        humidities: [],
        windSpeeds: [],
        conditions: [],
      });
    }
    const bucket = byDay.get(dayKey);
    bucket.temps.push(step.main.temp);
    bucket.humidities.push(step.main.humidity);
    bucket.windSpeeds.push(step.wind.speed);
    if (step.weather && step.weather[0]) {
      bucket.conditions.push(step.weather[0]);
    }
  }

  const average = (nums) =>
    nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

  // Pick the condition that appears most often during the day as representative.
  const dominantCondition = (conditions) => {
    if (!conditions.length) return { icon: "", description: "" };
    const counts = new Map();
    for (const c of conditions) {
      counts.set(c.icon, (counts.get(c.icon) || 0) + 1);
    }
    let best = conditions[0];
    let bestCount = 0;
    for (const c of conditions) {
      const count = counts.get(c.icon);
      if (count > bestCount) {
        best = c;
        bestCount = count;
      }
    }
    return best;
  };

  return Array.from(byDay.values())
    .slice(0, 5)
    .map((bucket) => {
      const condition = dominantCondition(bucket.conditions);
      return {
        dt: bucket.dt,
        tempMax: Math.max(...bucket.temps),
        tempMin: Math.min(...bucket.temps),
        humidity: Math.round(average(bucket.humidities)),
        windSpeed: Number(average(bucket.windSpeeds).toFixed(1)),
        icon: condition.icon,
        description: condition.description,
      };
    });
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Search for locations by name using the geocoding API. Returns normalized
 * location objects (with lat/lon) ready to drive a weather lookup.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export const searchLocations = async (query) => {
  assertConfigured();
  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const { data } = await client.get(ENDPOINTS.GEOCODE, {
    params: { q: trimmed, appid: API_KEY, limit: MAX_SUGGESTIONS },
  });

  return Array.isArray(data) ? data.map(normalizeLocation) : [];
};

/**
 * Fetch and normalize the current conditions for a coordinate.
 */
export const getCurrentWeather = async (lat, lon, units = DEFAULT_UNITS) => {
  assertConfigured();
  const { data } = await client.get(ENDPOINTS.WEATHER, {
    params: { lat, lon, ...baseParams(units) },
  });
  return normalizeCurrentWeather(data);
};

/**
 * Fetch the multi-day forecast for a coordinate, aggregated to daily summaries.
 */
export const getDailyForecast = async (lat, lon, units = DEFAULT_UNITS) => {
  assertConfigured();
  const { data } = await client.get(ENDPOINTS.FORECAST, {
    params: { lat, lon, ...baseParams(units) },
  });
  return aggregateDailyForecast(data && data.list);
};
