import React, { createContext, useState, useContext } from "react";

export const WeatherContext = createContext(); 

export const WeatherProvider = ({ children }) => {
    const [weather, setWeather] = useState(null);
    const [weatherForeCast, setWeatherForeCast] = useState(null);
    const [error, setError] = useState(null);
    const [degreeType, setDegreeType] = useState("metric");

    const toggleDegreeType = () => {
        setDegreeType((prevDegreeType) => (prevDegreeType === "metric" ? "imperial" : "metric"));
    };

    return (
        <WeatherContext.Provider value={{ weather, setWeather, error, setError, degreeType, toggleDegreeType, weatherForeCast, setWeatherForeCast }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => useContext(WeatherContext);