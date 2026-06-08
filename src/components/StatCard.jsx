import { motion } from "framer-motion";

/**
 * A single animated metric tile (Humidity, Wind, etc.).
 *
 * Extracted from WeatherDisplay so the grid is just data -> <StatCard />, and
 * the card styling/animation lives in exactly one place.
 *
 * @param {string} label - metric name
 * @param {React.ReactNode} value - formatted value to display
 * @param {React.ReactNode} icon - icon element
 * @param {number} [index=0] - position, used to stagger the entrance animation
 * @param {boolean} [capitalize=false] - capitalize the value text
 */
const StatCard = ({ label, value, icon, index = 0, capitalize = false }) => (
  <motion.div
    className="flex items-center justify-between rounded-2xl bg-gray-700 bg-opacity-75 p-6 text-white shadow-lg backdrop-blur-lg"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <div>
      <h2 className="mb-2 text-left text-2xl font-semibold">{label}</h2>
      <p className={`text-left text-xl ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
    <div className="ml-4 text-5xl text-white">{icon}</div>
  </motion.div>
);

export default StatCard;
