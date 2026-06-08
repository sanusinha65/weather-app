// Multi-day forecast grid.
//
// Now consumes the normalized daily-forecast shape produced by
// `aggregateDailyForecast` (flat `tempMax`/`tempMin`/`windSpeed`/`icon` fields)
// and uses shared formatters. A small ForecastCard keeps the map body tidy.

import { useContext } from "react";
import { motion } from "framer-motion";
import { WeatherContext } from "../context/WeatherContext";
import {
  buildIconUrl,
  formatForecastDate,
  formatPercent,
  formatTemperature,
  formatWindSpeed,
  titleCase,
} from "../utils/format";

/**
 * A single day's forecast tile.
 */
const ForecastCard = ({ day, units, index }) => (
  <motion.div
    className="rounded-2xl bg-gray-800 p-6 text-center text-white shadow-md"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <h3 className="text-lg font-medium">{formatForecastDate(day.dt)}</h3>
    <img
      src={buildIconUrl(day.icon)}
      alt={day.description}
      className="mx-auto h-16 w-16"
    />
    <p className="capitalize text-gray-300">{titleCase(day.description)}</p>
    <p className="text-xl font-semibold">
      {formatTemperature(day.tempMax, units)} /{" "}
      {formatTemperature(day.tempMin, units)}
    </p>
    <p className="text-gray-400">Wind: {formatWindSpeed(day.windSpeed, units)}</p>
    <p className="text-gray-400">Humidity: {formatPercent(day.humidity)}</p>
  </motion.div>
);

export default function WeatherForeCast() {
  const { forecast, units } = useContext(WeatherContext);

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-full border-t border-gray-400 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-center text-4xl font-semibold text-white">
          Weather Forecast
        </h1>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {forecast.map((day, index) => (
          <ForecastCard
            key={day.dt}
            day={day}
            units={units}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
