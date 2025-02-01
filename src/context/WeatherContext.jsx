import React, { createContext, useState, useContext } from "react";

// Create the context
export const WeatherContext = createContext(); // Export the context directly

// Create the provider component
export const WeatherProvider = ({ children }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [degreeType, setDegreeType] = useState("metric");

    const toggleDegreeType = () => {
        setDegreeType((prevDegreeType) => (prevDegreeType === "metric" ? "imperial" : "metric"));
    };

    return (
        <WeatherContext.Provider value={{ weather, setWeather, error, setError, degreeType, toggleDegreeType }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => useContext(WeatherContext);
