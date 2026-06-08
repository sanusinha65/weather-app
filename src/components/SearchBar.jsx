// Location search box with debounced autocomplete.
//
// Rewritten so it no longer talks to axios or hardcodes an API key. All data
// access goes through the hooks/service layer; this component only owns local
// UI state (the query text, the suggestion list, and scroll visibility).

import { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useLocationSearch, useWeatherData } from "../hooks/useWeather";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { SEARCH_DEBOUNCE_MS } from "../constants";
import { formatLocationLabel } from "../utils/format";
import UnitToggle from "./UnitToggle";

/**
 * Hook: hides the unit toggle while the user scrolls down, shows it on scroll
 * up. Kept local since it's purely presentational.
 */
const useScrollVisibility = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      setVisible(window.scrollY <= lastY);
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { search } = useLocationSearch();
  const { selectLocation } = useWeatherData();
  const toggleVisible = useScrollVisibility();

  // Debounce the raw query so we only hit the network when typing settles.
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  const runSearch = useCallback(
    async (value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        setSuggestions([]);
        setHasSearched(false);
        return;
      }
      const results = await search(trimmed);
      setSuggestions(results);
      setHasSearched(true);
    },
    [search]
  );

  // Fire the debounced search whenever the settled query changes.
  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  const handleSelect = async (location) => {
    setSuggestions([]);
    setHasSearched(false);
    setQuery(location.name);
    await selectLocation(location);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runSearch(query);
  };

  const showEmptyState = hasSearched && suggestions.length === 0;

  return (
    <div className="w-full py-10">
      <form
        onSubmit={handleSubmit}
        className="container mx-auto flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <input
          type="search"
          placeholder="Enter Location Name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:max-w-xs"
        />

        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-indigo-500 px-5 py-2 text-white transition-all duration-300 hover:scale-110 hover:bg-indigo-700 sm:w-auto"
          >
            <IoIosSearch className="mr-2 text-xl font-semibold text-white" />
            Search
          </button>
        </div>

        <UnitToggle visible={toggleVisible} />
      </form>

      {showEmptyState ? (
        <p className="mt-3 text-center text-xl font-semibold text-red-600">
          Please try a correct location name!
        </p>
      ) : (
        suggestions.length > 0 && (
          <div className="mx-auto mt-3 max-h-24 w-full overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 bg-opacity-90 shadow-lg md:w-2/3">
            <ul className="divide-y divide-gray-700">
              {suggestions.map((location) => (
                <li
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className="cursor-pointer p-3 text-white transition-all duration-200 hover:bg-indigo-600"
                >
                  {formatLocationLabel(location)}
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
