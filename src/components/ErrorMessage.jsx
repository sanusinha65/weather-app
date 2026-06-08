import { motion, AnimatePresence } from "framer-motion";
import { MdErrorOutline } from "react-icons/md";
import { useWeather } from "../context/WeatherContext";

/**
 * Inline error banner.
 *
 * Reads the current error from context and animates it in/out. Now uses the
 * `useWeather` hook (with its provider guard) instead of poking at the raw
 * context object, and renders nothing when there's no error.
 */
const ErrorMessage = () => {
  const { error } = useWeather();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          className="w-full py-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex flex-row items-center justify-center gap-3">
            <MdErrorOutline className="animate-pulse text-2xl text-red-600" />
            <p className="animate-pulse text-2xl font-semibold text-red-600">
              {error}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorMessage;
