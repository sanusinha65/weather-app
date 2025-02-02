import { useState, useContext, useEffect } from "react";
import { WeatherContext } from "../context/WeatherContext"; 
import axios from "axios";
import { IoIosSearch } from "react-icons/io";

const SearchBar = () => {
    const [city, setCity] = useState("");
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [listCount, setListCount] = useState(null);
    const [showButton, setShowButton] = useState(true);

    const { setWeather, setWeatherForeCast, setError, degreeType, toggleDegreeType } = useContext(WeatherContext); // Access degreeType from context
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    let lastScrollY = 0; 

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            setShowButton(false);
        } else {
            setShowButton(true);
        }
        lastScrollY = window.scrollY;
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchLocations = async (cityName) => {
        setListCount(null);
        setSuggestions([]);
        if (!cityName) {
            setListCount(0);
            return;
        }
        const URL = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${API_KEY}&units=${degreeType}`; 
        try {
            const response = await axios.get(URL);

            if (response.data.list) {
                setSuggestions(response.data.list);
                setListCount(response.data.list.length);
            } else {
                setListCount(0);
                setError(response.data.message || "No locations found. Please enter a valid city name!");
            }
        } catch (error) {
            setError("Failed to fetch locations. Please try again.");
            console.error("Error fetching locations:", error);
        }
    };

    const fetchWeather = async (lat, lon, name) => {
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${degreeType}`; // Use degreeType here

        try {
            const response = await axios.get(URL);
            setWeather(response.data);
            setError(null);
            setSuggestions([]);
            setCity(name);
            setLat(lat);
            setLong(lon);
            localStorage.setItem("lastCity", name);
            localStorage.setItem("lastLat", lat);
            localStorage.setItem("lastLong", lon);
        } catch (error) {
            setError("Error fetching weather. Please try again.");
        }
        fetchFiveDaysForecast(lat, lon);
    };

    const fetchFiveDaysForecast = async (lat, lon) => {
        const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=5796abbde9106b7da4febfae8c44c232&units=${degreeType}`; // Use degreeType here

        try {
            const response = await axios.get(URL);
            setWeatherForeCast(response.data.daily);
        } catch (error) {
            setError("Error fetching weather. Please try again.");
        }
    }

    return (
        <div className="w-full py-10">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                {/* Input Field */}
                <input
                    type="search"
                    placeholder="Enter Location Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full md:max-w-xs rounded-lg py-2 px-4 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Button Wrapper */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
                    {/* Search Button */}
                    <button
                        className="flex items-center justify-center py-2 px-5 text-white bg-indigo-500 rounded-lg hover:scale-110 hover:bg-indigo-700 transition-all duration-300 w-full sm:w-auto"
                        onClick={() => fetchLocations(city)}
                    >
                        <IoIosSearch className="text-xl text-white font-semibold mr-2" />
                        Search
                    </button>

                    <button
                        className={`fixed right-5 top-1/2 transform -translate-y-1/2 z-50 flex items-center gap-3 bg-gray-900 p-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ${showButton ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                        onClick={toggleDegreeType}
                    >
                        {/* Background Slider */}
                        <div className="relative w-24 h-12 bg-gray-700 rounded-full flex items-center p-1 transition-all duration-300">
                            <div
                                className={`absolute w-10 h-10 bg-black rounded-full shadow-md transform transition-transform duration-300 ${degreeType === "metric" ? "translate-x-0" : "translate-x-12"}`}
                            ></div>

                            <span className={`absolute left-3 text-lg font-semibold transition-opacity ${degreeType === "metric" ? "text-white opacity-100" : "text-gray-300 opacity-80"}`}>
                                °C
                            </span>

                            <span className={`absolute right-4 text-lg font-semibold transition-opacity ${degreeType === "metric" ? "text-gray-300 opacity-80" : "text-white opacity-100"}`}>
                                °F
                            </span>
                        </div>
                    </button>


                </div>
            </div>

            {listCount === 0 ? (
                <p className="text-red-600 font-semibold text-xl text-center mt-3">Please try a correct location name!</p>
            ) : (
                suggestions.length > 0 && (
                    <div className="w-full md:w-2/3 mx-auto mt-3 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg border border-gray-700 max-h-24 overflow-y-auto">
                        <ul className="divide-y divide-gray-700">
                            {suggestions.map((location) => (
                                <li
                                    key={location.id}
                                    onClick={() => fetchWeather(location.coord.lat, location.coord.lon, location.name)}
                                    className="p-3 text-white hover:bg-indigo-600 transition-all duration-200 cursor-pointer"
                                >
                                    {location.name}, {location.sys.country}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            )}
        </div>
    );
};

export default SearchBar;