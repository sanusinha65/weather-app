// Pure, framework-agnostic formatting helpers.
//
// These functions take raw API values and return display-ready strings. Keeping
// them pure (no React, no side effects) makes them trivial to reason about and
// to unit test, and stops every component from re-implementing the same
// date/temperature/unit string logic.

import { ENDPOINTS, UNIT_SYSTEMS, DEFAULT_UNITS } from "../constants";

/**
 * Resolve a unit-system descriptor from its id, falling back to the default.
 * @param {string} unitId - "metric" | "imperial"
 */
export const getUnitSystem = (unitId) =>
  UNIT_SYSTEMS[unitId] || UNIT_SYSTEMS[DEFAULT_UNITS];

/**
 * Format a temperature value with the correct degree suffix.
 * @param {number} value - raw temperature
 * @param {string} unitId - unit system id
 * @param {object} [options]
 * @param {boolean} [options.round=true] - round to the nearest integer
 */
export const formatTemperature = (value, unitId, { round = true } = {}) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }
  const numeric = round ? Math.round(Number(value)) : Number(value);
  return `${numeric}${getUnitSystem(unitId).temperature}`;
};

/**
 * Format a wind speed with the unit-appropriate suffix.
 */
export const formatWindSpeed = (value, unitId) => {
  if (value === null || value === undefined) return "--";
  return `${value} ${getUnitSystem(unitId).speed}`;
};

/**
 * Format a percentage (humidity, cloud cover, etc.).
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined) return "--";
  return `${Math.round(value)}%`;
};

/**
 * OpenWeather reports visibility in meters. Convert to the user's distance unit.
 */
export const formatVisibility = (meters, unitId) => {
  if (meters === null || meters === undefined) return "--";
  const unit = getUnitSystem(unitId);
  const value =
    unit.distance === "mi" ? meters / 1609.344 : meters / 1000;
  return `${value.toFixed(1)} ${unit.distance}`;
};

/**
 * Build the URL for an OpenWeather condition icon.
 * @param {string} icon - icon code, e.g. "10d"
 * @param {"2x"|"4x"} [size="2x"]
 */
export const buildIconUrl = (icon, size = "2x") => {
  if (!icon) return "";
  const suffix = size === "4x" ? "@4x" : "@2x";
  return `${ENDPOINTS.ICON}/${icon}${suffix}.png`;
};

/**
 * Capitalize the first letter of each word — used for weather descriptions
 * like "broken clouds" -> "Broken Clouds".
 */
export const titleCase = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Format a unix timestamp (seconds) as a short weekday + date label.
 * e.g. "Mon, Jun 8"
 */
export const formatForecastDate = (unixSeconds) =>
  new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

/**
 * Format a Date as a compact day/month/year string. e.g. "8 Jun 26"
 */
export const formatShortDate = (date = new Date()) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

/**
 * Get the full weekday name for a date. e.g. "Monday"
 */
export const formatWeekday = (date = new Date()) =>
  date.toLocaleDateString("default", { weekday: "long" });

/**
 * Format a Date as a localized clock string. e.g. "12:52:07 PM"
 */
export const formatClock = (date = new Date()) => date.toLocaleTimeString();

/**
 * Compose a "City, Country" (and optional state) label from a location object.
 */
export const formatLocationLabel = ({ name, state, country } = {}) =>
  [name, state, country].filter(Boolean).join(", ");
