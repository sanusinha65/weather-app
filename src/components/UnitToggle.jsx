import { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

/**
 * Floating Celsius/Fahrenheit toggle.
 *
 * Extracted out of SearchBar so the search box stays focused on search. The
 * toggle reads and flips the unit preference directly through context.
 *
 * @param {boolean} visible - whether the control is currently shown
 */
const UnitToggle = ({ visible = true }) => {
  const { units, toggleUnits } = useContext(WeatherContext);
  const isMetric = units === "metric";

  return (
    <button
      type="button"
      aria-label={`Switch to ${isMetric ? "Fahrenheit" : "Celsius"}`}
      onClick={toggleUnits}
      className={`fixed right-5 top-1/2 z-50 flex -translate-y-1/2 transform items-center gap-3 rounded-full bg-gray-900 p-2 shadow-lg transition-all duration-300 hover:scale-105 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative flex h-12 w-24 items-center rounded-full bg-gray-700 p-1 transition-all duration-300">
        <div
          className={`absolute h-10 w-10 transform rounded-full bg-black shadow-md transition-transform duration-300 ${
            isMetric ? "translate-x-0" : "translate-x-12"
          }`}
        />
        <span
          className={`absolute left-3 text-lg font-semibold transition-opacity ${
            isMetric ? "text-white opacity-100" : "text-gray-300 opacity-80"
          }`}
        >
          °C
        </span>
        <span
          className={`absolute right-4 text-lg font-semibold transition-opacity ${
            isMetric ? "text-gray-300 opacity-80" : "text-white opacity-100"
          }`}
        >
          °F
        </span>
      </div>
    </button>
  );
};

export default UnitToggle;
