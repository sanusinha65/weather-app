import axios from "axios";

// const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const getCurrentWeather = async (lat, lon, units = "metric") => {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: API_KEY, units },
  });
  return data;
};

export const getFiveDayForecast = async (lat, lon, units = "metric") => {
  const { data } = await axios.get(`${BASE_URL}/onecall`, {
    params: { lat, lon, appid: API_KEY, units },
  });
  return data.daily;
};

export const searchLocations = async (cityName, units = "metric") => {
  const { data } = await axios.get(`${BASE_URL}/find`, {
    params: { q: cityName, appid: API_KEY, units },
  });
  return data;
};
