// Global weather state.
//
// Rewritten from a pile of independent `useState` calls into a single reducer.
// A reducer gives us:
//   * one obvious place to see every state transition,
//   * atomic updates (status + error can change together),
//   * and easy persistence of the user's preferred units.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { DEFAULT_UNITS, STORAGE_KEYS, UNIT_SYSTEMS } from "../constants";
import { getUnitSystem } from "../utils/format";

export const WeatherContext = createContext(null);

/**
 * Read the persisted unit preference, defaulting safely.
 */
const readInitialUnits = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.UNITS);
    return UNIT_SYSTEMS[stored] ? stored : DEFAULT_UNITS;
  } catch {
    return DEFAULT_UNITS;
  }
};

const initialState = {
  weather: null,
  forecast: null,
  error: null,
  // "idle" | "loading" | "ready"
  status: "idle",
  units: readInitialUnits(),
};

// Action types kept as constants to avoid stringly-typed bugs.
const ACTIONS = {
  SET_WEATHER: "SET_WEATHER",
  SET_FORECAST: "SET_FORECAST",
  SET_ERROR: "SET_ERROR",
  SET_STATUS: "SET_STATUS",
  TOGGLE_UNITS: "TOGGLE_UNITS",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_WEATHER:
      return { ...state, weather: action.payload };
    case ACTIONS.SET_FORECAST:
      return { ...state, forecast: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_STATUS:
      return { ...state, status: action.payload };
    case ACTIONS.TOGGLE_UNITS:
      return {
        ...state,
        units: state.units === "metric" ? "imperial" : "metric",
      };
    default:
      return state;
  }
}

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist the unit preference whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UNITS, state.units);
    } catch {
      // best-effort persistence
    }
  }, [state.units]);

  // Memoize the context value so consumers don't re-render on unrelated
  // parent renders. The action creators are stable for the life of the
  // provider because `dispatch` identity never changes.
  const value = useMemo(
    () => ({
      // state
      weather: state.weather,
      forecast: state.forecast,
      error: state.error,
      status: state.status,
      units: state.units,
      unitSystem: getUnitSystem(state.units),

      // actions
      setWeather: (payload) =>
        dispatch({ type: ACTIONS.SET_WEATHER, payload }),
      setForecast: (payload) =>
        dispatch({ type: ACTIONS.SET_FORECAST, payload }),
      setError: (payload) => dispatch({ type: ACTIONS.SET_ERROR, payload }),
      setStatus: (payload) => dispatch({ type: ACTIONS.SET_STATUS, payload }),
      toggleUnits: () => dispatch({ type: ACTIONS.TOGGLE_UNITS }),
    }),
    [state.weather, state.forecast, state.error, state.status, state.units]
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

/**
 * Convenience hook with a guard so misuse outside the provider fails loudly.
 */
export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return ctx;
};
