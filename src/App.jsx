// Application shell.
//
// All data-fetching, polling, and persistence logic moved into `useWeatherData`
// and the service layer. This component is now purely structural: it lays out
// the header, search, and the two weather panels, and surfaces a config error
// if the API key is missing.

import { useEffect } from "react";
import { IoIosSunny } from "react-icons/io";
import "./App.css";
import ErrorMessage from "./components/ErrorMessage";
import SearchBar from "./components/SearchBar";
import WeatherDisplay from "./components/WeatherDisplay";
import WeatherForeCast from "./components/WeatherForeCast";
import { API_KEY, MESSAGES } from "./constants";
import { useWeather } from "./context/WeatherContext";
import { useWeatherData } from "./hooks/useWeather";

const AppHeader = () => (
  <div className="flex flex-col items-center justify-center text-white">
    <div className="flex flex-row items-center">
      <IoIosSunny className="mx-2 animate-spin text-3xl text-white md:text-6xl" />
      <h1 className="py-2 text-center text-2xl font-bold md:text-5xl">
        Weather Report
      </h1>
    </div>
    <h2 className="text-center text-sm text-gray-300 md:text-lg">
      The Only Weather App You Need!
    </h2>
  </div>
);

const App = () => {
  const { setError } = useWeather();

  // Wires up location restore + polling. Side effects all live in the hook.
  useWeatherData();

  // Surface a clear, actionable message when the app isn't configured.
  useEffect(() => {
    if (!API_KEY) {
      setError(MESSAGES.MISSING_API_KEY);
    }
  }, [setError]);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-800 to-black p-3 md:p-6">
      <div className="mx-auto mb-10 h-[60vh] max-w-screen-3xl border-b border-white">
        <AppHeader />
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
