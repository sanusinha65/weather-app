import { useContext, useState, useEffect } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { IoLocation } from "react-icons/io5";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { WiHumidity } from "react-icons/wi";
import { BsWind, BsClouds } from "react-icons/bs";
import { MdOutlineVisibility } from "react-icons/md";

const WeatherDisplay = () => {
    const { weather, degreeType } = useContext(WeatherContext);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // State for time
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString()); // Update time
        }, 1000); // Update every 1 second

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    if (!weather) return null;
    const currentDate = new Date();
    const dateString = currentDate.toLocaleString('default', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const dayString = currentDate.toLocaleString('default', { weekday: 'long' }); 

    return (
        <div className="text-white translate-y-0 lg:-translate-y-1/3">
            {/* Card for Location, Date, Day, and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white mb-6">
                    {/* Location with Icon */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-semibold py-2 capitalize">{weather.name}</h2>
                            {/* Date, Day, and Time */}
                            <div className="text-sm font-semibold capitalize">
                                <p>{dayString}, {dateString} <span className="uppercase">({currentTime})</span></p>
                            </div>
                        </div>
                        <IoLocation className="text-4xl text-white ml-2" />
                    </div>
                </div>

                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white mb-6">
                    {/* Temperature with Icon */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-semibold py-2">{parseInt(weather.main.temp)}{degreeType === "metric" ? "°C" : "°F"}</h2>
                            {/* Date, Day, and Time */}
                            <div className="text-sm font-semibold text-center capitalize">
                                <p>Feels Like: {weather.main.feels_like}{degreeType === "metric" ? "°C" : "°F"}</p>
                            </div>
                        </div>
                        <LiaTemperatureHighSolid className="text-4xl text-white ml-2" />
                    </div>
                    {/* Feels Like */}
                    <div className="text-lg font-semibold text-center">
                        <p className="text-sm"></p>
                    </div>
                </div>
            </div>

            {/* Weather Data Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
                {[
                    { label: "Visibility", data: `${weather.visibility / 1000} KM`, icon: <MdOutlineVisibility /> },
                    { label: "Humidity", data: `${weather.main.humidity}%`, icon: <WiHumidity /> },
                    { label: "Wind Speed", data: `${weather.wind.speed} ${degreeType === 'metric' ? 'm/s' : 'mph'}`, icon: <BsWind /> },
                    { label: "Condition", data: weather.weather[0].description, icon: <BsClouds />, capitalize: true }, // Capitalize description text
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-white flex items-center justify-between min-w-0 flex-grow break-words"
                    >
                        {/* Text and Data on the Left */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-2 text-left overflow-hidden text-ellipsis">{item.label}</h2>
                            <p className={`text-xl text-left ${item.capitalize ? 'capitalize' : ''}`}>{item.data}</p>
                        </div>
                        {/* Icon on the Right */}
                        <div className="text-5xl text-white ml-4">
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherDisplay;