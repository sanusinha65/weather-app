import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import { WeatherContext } from "../context/WeatherContext";
import { IoLocation } from "react-icons/io5";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { WiHumidity } from "react-icons/wi";
import { BsWind, BsClouds } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";

const WeatherDisplay = () => {
    const { weather, degreeType } = useContext(WeatherContext);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (!weather) return null;

    const currentDate = new Date();
    const dateString = currentDate.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
    });

    const dayString = currentDate.toLocaleString('default', { weekday: 'long' });

    // Weather icon URL from OpenWeather API
    const weatherIconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

    return (
        <motion.div
            className="text-white translate-y-0 lg:-translate-y-1/3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Location & Temperature Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    className="bg-gray-700 bg-opacity-75 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-semibold py-2 capitalize">{weather.name}</h2>
                            <p className="text-sm font-semibold capitalize">{dayString}, {dateString} <span className="uppercase">({currentTime})</span></p>
                        </div>
                        <IoLocation className="text-4xl text-white ml-2" />
                    </div>
                </motion.div>

                <motion.div
                    className="bg-gray-700 bg-opacity-75 backdrop-blur-lg  rounded-2xl p-6 shadow-lg text-white"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-between">
                        {/* Temperature and Icon */}
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <h2 className="text-3xl font-semibold py-2">
                                    {parseInt(weather.main.temp)}{degreeType === "metric" ? "°C" : "°F"}
                                </h2>
                                <img src={weatherIconUrl} alt={weather.weather[0].description} className="w-16 h-16 ml-2" />
                            </div>
                            <p className="text-sm font-semibold capitalize">Feels Like: {weather.main.feels_like}{degreeType === "metric" ? "°C" : "°F"}</p>
                        </div>
                        <LiaTemperatureHighSolid className="text-4xl text-white ml-2" />
                    </div>
                </motion.div>
            </div>

            {/* Weather Data Cards with Scroll Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {[
                    { label: "Visibility", data: `${weather.visibility / 1000} KM`, icon: <MdOutlineVisibility /> },
                    { label: "Humidity", data: `${weather.main.humidity}%`, icon: <WiHumidity /> },
                    { label: "Wind Speed", data: `${weather.wind.speed} ${degreeType === 'metric' ? 'm/s' : 'mph'}`, icon: <BsWind /> },
                    { label: "Condition", data: weather.weather[0].description, icon: <BsClouds />, capitalize: true },
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        className="bg-gray-700 bg-opacity-75 backdrop-blur-lg  rounded-2xl p-6 shadow-lg text-white flex items-center justify-between"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-left">{item.label}</h2>
                            <p className={`text-xl text-left ${item.capitalize ? 'capitalize' : ''}`}>{item.data}</p>
                        </div>
                        <div className="text-5xl text-white ml-4">{item.icon}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default WeatherDisplay;
