import React, { useContext } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { WeatherContext } from "../context/WeatherContext";

export default function WeatherForeCast() {
    const { weatherForeCast, degreeType } = useContext(WeatherContext);

    // Ensure forecast data is available before rendering
    if (!weatherForeCast || weatherForeCast.length === 0) {
        return <p className="text-center text-white"></p>;
    }

    // Function to format date
    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <motion.div 
            className="min-h-screen p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Title Section */}
            <motion.div
                className="w-full border-t border-gray-400 py-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-4xl text-white text-center font-semibold">
                    Weather Forecast
                </h1>
            </motion.div>

            {/* Forecast Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {weatherForeCast.map((day, index) => (
                    <motion.div
                        key={index}
                        className="bg-gray-800 text-white rounded-2xl p-6 shadow-md text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-lg font-medium">{formatDate(day.dt)}</h3>
                        <img
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].description}
                            className="mx-auto w-16 h-16"
                        />
                        <p className="text-gray-300 capitalize">{day.weather[0].description}</p>
                        <p className="text-xl font-semibold">
                            {Math.round(day.temp.max)} / {Math.round(day.temp.min)} {degreeType === "metric" ? "°C" : "°F"}
                        </p>
                        <p className="text-gray-400">Wind: {day.wind_speed} {degreeType === 'metric' ? 'm/s' : 'mph'}</p>
                        <p className="text-gray-400">Humidity: {day.humidity}%</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
