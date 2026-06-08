// Current-conditions panel.
//
// Rewritten to consume the *normalized* weather object from the service layer
// (flat fields like `temp`, `feelsLike`, `windSpeed`) and to delegate all
// value formatting to the shared `utils/format` helpers. Repeated unit ternary
// expressions and deep property access (`weather.main.feels_like`) are gone.

import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoLocation } from "react-icons/io5";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { WiHumidity } from "react-icons/wi";
import { BsWind, BsClouds } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";
import { WeatherContext } from "../context/WeatherContext";
import StatCard from "./StatCard";
import {
  buildIconUrl,
  formatClock,
  formatPercent,
  formatShortDate,
  formatTemperature,
  formatVisibility,
  formatWeekday,
  formatWindSpeed,
} from "../utils/format";

/**
 * Hook: a clock that updates once per second. Isolated so the rest of the
 * component is purely derived from props/context.
 */
const useTicker = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const cardEnter = (direction) => ({
  initial: { opacity: 0, x: direction },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
  viewport: { once: true },
});

const WeatherDisplay = () => {
  const { weather, units } = useContext(WeatherContext);
  const now = useTicker();

  if (!weather) return null;

  const stats = [
    {
      label: "Visibility",
      value: formatVisibility(weather.visibility, units),
      icon: <MdOutlineVisibility />,
    },
    {
      label: "Humidity",
      value: formatPercent(weather.humidity),
      icon: <WiHumidity />,
    },
    {
      label: "Wind Speed",
      value: formatWindSpeed(weather.windSpeed, units),
      icon: <BsWind />,
    },
    {
      label: "Condition",
      value: weather.description,
      icon: <BsClouds />,
      capitalize: true,
    },
  ];

  return (
    <motion.div
      className="translate-y-0 text-white lg:-translate-y-1/3"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Location + local time */}
        <motion.div
          className="rounded-2xl bg-gray-700 bg-opacity-75 p-6 text-white shadow-lg backdrop-blur-lg"
          {...cardEnter(-50)}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="py-2 text-3xl font-semibold capitalize">
                {weather.city}
              </h2>
              <p className="text-sm font-semibold capitalize">
                {formatWeekday(now)}, {formatShortDate(now)}{" "}
                <span className="uppercase">({formatClock(now)})</span>
              </p>
            </div>
            <IoLocation className="ml-2 text-4xl text-white" />
          </div>
        </motion.div>

        {/* Temperature + feels-like */}
        <motion.div
          className="rounded-2xl bg-gray-700 bg-opacity-75 p-6 text-white shadow-lg backdrop-blur-lg"
          {...cardEnter(50)}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center">
                <h2 className="py-2 text-3xl font-semibold">
                  {formatTemperature(weather.temp, units)}
                </h2>
                <img
                  src={buildIconUrl(weather.icon)}
                  alt={weather.description}
                  className="ml-2 h-16 w-16"
                />
              </div>
              <p className="text-sm font-semibold capitalize">
                Feels Like:{" "}
                {formatTemperature(weather.feelsLike, units, { round: false })}
              </p>
            </div>
            <LiaTemperatureHighSolid className="ml-2 text-4xl text-white" />
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            index={index}
            capitalize={stat.capitalize}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherDisplay;
