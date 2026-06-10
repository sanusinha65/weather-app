import React, { createContext, useContext, useState } from "react";

export const WeatherContext = createContext(); 

export const WeatherProvider = ({ children }) => {
    const [weather, setWeather] = useState(null);
    const [weatherForeCast, setWeatherForeCast] = useState(null);
    const [error, setError] = useState(null);
    const [degreeType, setDegreeType] = useState(localStorage.getItem("degreeType") || "metric");

    const toggleDegreeType = () => {
        setDegreeType((prevDegreeType) => {
            const next = prevDegreeType === "metric" ? "imperial" : "metric";
            localStorage.setItem("degreeType", prevDegreeType);
            return next;
        });
    };

    return (
        <WeatherContext.Provider value={{ weather, setWeather, error, setError, degreeType, toggleDegreeType, weatherForeCast, setWeatherForeCast }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => useContext(WeatherContext);