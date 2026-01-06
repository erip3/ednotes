/** @type {import('tailwindcss').Config} */
// Re-export client's tailwind config but adjust content paths
import clientConfig from "../client/tailwind.config.js";

export default {
  ...clientConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../client/src/**/*.{js,ts,jsx,tsx}", // Include client files for shared components
  ],
};
