// Central configuration and constants for the Weather Report app.
//
// Keeping every "magic value" in one place makes the rest of the codebase
// declarative: components and services import from here instead of hardcoding
// URLs, keys, intervals, or string literals that are easy to mistype.

/**
 * API key is read from the environment. Never hardcode keys in source files.
 * Create a `.env` file at the project root with:
 *
 *   REACT_APP_WEATHER_API_KEY=your_key_here
 */
export const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "";

/**
 * Base URLs for the OpenWeather endpoints we rely on.
 * The previous implementation referenced an undefined `BASE_URL`, which threw
 * at runtime. Centralizing these prevents that whole class of bug.
 */
export const ENDPOINTS = {
  WEATHER: "https://api.openweathermap.org/data/2.5/weather",
  FORECAST: "https://api.openweathermap.org/data/2.5/forecast",
  GEOCODE: "https://api.openweathermap.org/geo/1.0/direct",
  ICON: "https://openweathermap.org/img/wn",
};

/**
 * Supported unit systems. We model these as objects rather than bare strings so
 * the UI can render the correct suffixes without scattering ternaries
 * everywhere (`degreeType === "metric" ? "°C" : "°F"` was repeated all over).
 */
export const UNIT_SYSTEMS = {
  metric: {
    id: "metric",
    label: "Celsius",
    temperature: "°C",
    speed: "m/s",
    distance: "km",
  },
  imperial: {
    id: "imperial",
    label: "Fahrenheit",
    temperature: "°F",
    speed: "mph",
    distance: "mi",
  },
};

export const DEFAULT_UNITS = "metric";

/**
 * How often the current conditions are silently re-fetched, in milliseconds.
 */
export const REFRESH_INTERVAL_MS = 30_000;

/**
 * Debounce window for the search-as-you-type box, in milliseconds. Prevents a
 * network request on every single keystroke.
 */
export const SEARCH_DEBOUNCE_MS = 400;

/**
 * Maximum number of location suggestions to request/show.
 */
export const MAX_SUGGESTIONS = 5;

/**
 * localStorage keys, grouped so we never typo a key in one place and read a
 * different one somewhere else.
 */
export const STORAGE_KEYS = {
  CITY: "lastCity",
  LAT: "lastLat",
  LON: "lastLong",
  UNITS: "preferredUnits",
};

/**
 * Human-friendly, reusable copy for the various error states. Centralizing
 * these keeps tone consistent and makes future localization trivial.
 */
export const MESSAGES = {
  MISSING_API_KEY:
    "Weather service is not configured. Add REACT_APP_WEATHER_API_KEY to your .env file.",
  EMPTY_QUERY: "Please enter a location name to search.",
  NO_RESULTS: "No matching locations found. Try a different spelling.",
  LOCATION_FAILED: "Could not load locations. Please try again.",
  WEATHER_FAILED: "Could not load the weather right now. Please try again.",
  FORECAST_FAILED: "Could not load the forecast right now. Please try again.",
};
