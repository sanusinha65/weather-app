import { useCallback, useContext, useEffect } from "react";
import { IoIosSunny } from "react-icons/io";
import "./App.css";
import ErrorMessage from "./components/ErrorMessage";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";
import WeatherForeCast from "./components/WeatherForeCast";
import { WeatherContext } from "./context/WeatherContext";
import { getCurrentWeather, getFiveDayForecast } from "./services/weatherApi";

const REFRESH_INTERVAL = 30000; // Re-fetch current weather every 30 seconds

const App = () => {
  const { setWeather, setWeatherForeCast, degreeType } = useContext(WeatherContext);

  const fetchWeather = useCallback(
    async (lat, lon) => {
      try {
        setWeather(await getCurrentWeather(lat, lon, degreeType));
      } catch (err) {
        console.error("Failed to fetch weather data", err);
      }
    },
    [degreeType, setWeather]
  );

  const fetchFiveDaysForecast = useCallback(
    async (lat, lon) => {
      try {
        setWeatherForeCast(await getFiveDayForecast(lat, lon, degreeType));
      } catch (err) {
        console.error("Failed to fetch forecast data", err);
      }
    },
    [degreeType, setWeatherForeCast]
  );

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    const lastLat = localStorage.getItem("lastLat");
    const lastLong = localStorage.getItem("lastLong");

    if (!lastCity) return;

    fetchWeather(lastLat, lastLong);
    fetchFiveDaysForecast(lastLat, lastLong);

    const interval = setInterval(() => {
      fetchWeather(lastLat, lastLong);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchWeather, fetchFiveDaysForecast]);

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
