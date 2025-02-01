// components/SearchBar.js
import { useState, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext"; // Import your existing context
import axios from "axios";
import { IoIosSearch } from "react-icons/io";

const SearchBar = () => {
    const [city, setCity] = useState("");
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [listCount, setListCount] = useState(null);
    const { setWeather, setError, degreeType, toggleDegreeType } = useContext(WeatherContext); // Access degreeType from context
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

    // Fetch location suggestions
    const fetchLocations = async (cityName) => {
        setListCount(null);
        setSuggestions([]);
        if (!cityName) {
            setListCount(0);
            return;
        }
        const URL = `https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${API_KEY}&units=${degreeType}`; // Use degreeType here
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
            localStorage.setItem("lastCity", name); // Store in local storage
            localStorage.setItem("lastLat", lat); // Store in local storage
            localStorage.setItem("lastLong", lon); // Store in local storage
        } catch (error) {
            setError("Error fetching weather. Please try again.");
        }
    };

    return (
        <div className="w-full py-10">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
  {/* Input Field */}
  <input
    type="text"
    placeholder="Enter Location Name"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="w-full max-w-lg rounded-lg py-2 px-4 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

    {/* Degree Type Toggle */}
    <button
      className="flex items-center justify-center py-2 px-5 text-white bg-indigo-500 rounded-lg hover:scale-110 hover:bg-indigo-700 transition-all duration-300 w-full sm:w-auto"
      onClick={toggleDegreeType}
    >
      Switch to {degreeType === "metric" ? "°F" : "°C"}
    </button>
  </div>
</div>

            {/* Suggestions Dropdown */}
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