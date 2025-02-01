import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

const ErrorMessage = () => {
    const { error } = useContext(WeatherContext);
    return error ? <div className="w-full py-5">
        <div className="flex flex-row items-center justify-center gap-3"><p className="text-red-600 text-2xl animate-pulse font-semibold">{error}</p></div></div> : null;
};

export default ErrorMessage;
