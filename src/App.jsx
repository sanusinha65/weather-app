import { useEffect, useContext } from "react";
import { WeatherContext } from "./context/WeatherContext";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";
import ErrorMessage from "./components/ErrorMessage";
import axios from "axios";
import "./App.css";
import { IoIosSunny } from "react-icons/io";
import WeatherForeCast from "./components/WeatherForeCast";

const App = () => {
  const { setWeather, setWeatherForeCast, degreeType } = useContext(WeatherContext);

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    const lastLat = localStorage.getItem("lastLat");
    const lastLong = localStorage.getItem("lastLong");

    if (lastCity) {
      fetchWeather(lastLat, lastLong);
      fetchFiveDaysForecast(lastLat, lastLong);
    }

    const interval = setInterval(() => {
      if (lastCity) {
        fetchWeather(lastLat, lastLong);
      }
    }, 30000); // Re-fetching Data After Every 30 Seconds

    return () => clearInterval(interval);
  }, [degreeType]);

  const fetchWeather = async (lat, lon) => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${degreeType}`;

    try {
      const response = await axios.get(URL);
      setWeather(response.data);
    } catch (err) {
      console.error("Failed to fetch weather data", err);
    }
  };

  const fetchFiveDaysForecast = async (lat, lon) => {
    const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=5796abbde9106b7da4febfae8c44c232&units=${degreeType}`; 

    try {
        const response = await axios.get(URL);
        setWeatherForeCast(response.data.daily);
    } catch (error) {
        console.error("Error fetching weather. Please try again.");
    }
}

  return (
    <div className="bg-gradient-to-bl from-gray-800 to-black p-3 md:p-6 min-h-screen">
      <div className="h-[60vh] max-w-screen-3xl mx-auto border-b border-white mb-10">
        <div className="flex flex-col items-center justify-center text-white">
          <div className="flex flex-row items-center">
            <IoIosSunny className="text-3xl md:text-6xl mx-2 text-white animate-spin" />
            <h1 className="text-2xl md:text-5xl font-bold py-2 text-center">Weather Report</h1>
          </div>
          <h2 className="text-sm md:text-lg text-gray-300 text-center">The Only Weather App You Need!</h2>
        </div>
        <SearchBar />
        <ErrorMessage />
      </div>
      <div className="lg:-translate-y-1/3">
        <WeatherDisplay />
      </div>
      <div>
        <WeatherForeCast />
      </div>
    </div>
  );
};

export default App;
