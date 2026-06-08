// High-level data hooks that bridge the service layer and the context.
//
// Components call these hooks and get back simple callbacks plus loading/error
// state. They never deal with axios, localStorage, or response normalization —
// that all lives below this line.

import { useCallback, useEffect, useRef } from "react";
import { useWeather as useWeatherContext } from "../context/WeatherContext";
import {
  getCurrentWeather,
  getDailyForecast,
  searchLocations,
} from "../services/weatherApi";
import {
  REFRESH_INTERVAL_MS,
  STORAGE_KEYS,
  MESSAGES,
} from "../constants";

/**
 * Persist the last viewed coordinate so the app can restore it on reload.
 */
const rememberLocation = ({ name, lat, lon }) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CITY, name ?? "");
    localStorage.setItem(STORAGE_KEYS.LAT, String(lat));
    localStorage.setItem(STORAGE_KEYS.LON, String(lon));
  } catch {
    // localStorage can throw in private mode; persistence is best-effort.
  }
};

/**
 * Read the previously persisted coordinate, or null if none.
 */
const readRememberedLocation = () => {
  try {
    const name = localStorage.getItem(STORAGE_KEYS.CITY);
    const lat = localStorage.getItem(STORAGE_KEYS.LAT);
    const lon = localStorage.getItem(STORAGE_KEYS.LON);
    if (!name || lat === null || lon === null) return null;
    return { name, lat: Number(lat), lon: Number(lon) };
  } catch {
    return null;
  }
};

/**
 * Central hook that owns loading weather + forecast for a coordinate and wiring
 * the results back into context. Returns imperative helpers used by the UI.
 */
export function useWeatherData() {
  const {
    units,
    setWeather,
    setForecast,
    setError,
    setStatus,
  } = useWeatherContext();

  // Keep the latest units in a ref so the polling interval always reads the
  // current value without needing to be torn down and recreated on every
  // toggle.
  const unitsRef = useRef(units);
  useEffect(() => {
    unitsRef.current = units;
  }, [units]);

  const loadWeather = useCallback(
    async (lat, lon) => {
      try {
        const data = await getCurrentWeather(lat, lon, unitsRef.current);
        setWeather(data);
      } catch (err) {
        console.error("Failed to load current weather", err);
        setError(MESSAGES.WEATHER_FAILED);
      }
    },
    [setWeather, setError]
  );

  const loadForecast = useCallback(
    async (lat, lon) => {
      try {
        const data = await getDailyForecast(lat, lon, unitsRef.current);
        setForecast(data);
      } catch (err) {
        console.error("Failed to load forecast", err);
        setError(MESSAGES.FORECAST_FAILED);
      }
    },
    [setForecast, setError]
  );

  /**
   * Load everything for a selected location and persist it.
   */
  const selectLocation = useCallback(
    async ({ lat, lon, name }) => {
      setStatus("loading");
      setError(null);
      await Promise.all([loadWeather(lat, lon), loadForecast(lat, lon)]);
      rememberLocation({ lat, lon, name });
      setStatus("ready");
    },
    [loadWeather, loadForecast, setError, setStatus]
  );

  // On mount: restore the last location (if any) and start polling current
  // conditions on an interval.
  useEffect(() => {
    const remembered = readRememberedLocation();
    if (!remembered) return undefined;

    loadWeather(remembered.lat, remembered.lon);
    loadForecast(remembered.lat, remembered.lon);

    const interval = setInterval(() => {
      loadWeather(remembered.lat, remembered.lon);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [loadWeather, loadForecast]);

  return { selectLocation, loadWeather, loadForecast };
}

/**
 * Hook that wraps location search. Exposes a single async `search` function
 * that surfaces friendly errors through context.
 */
export function useLocationSearch() {
  const { setError } = useWeatherContext();

  const search = useCallback(
    async (query) => {
      try {
        const results = await searchLocations(query);
        if (results.length === 0) {
          setError(MESSAGES.NO_RESULTS);
        } else {
          setError(null);
        }
        return results;
      } catch (err) {
        console.error("Location search failed", err);
        setError(MESSAGES.LOCATION_FAILED);
        return [];
      }
    },
    [setError]
  );

  return { search };
}
