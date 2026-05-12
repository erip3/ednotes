/** @type {import('tailwindcss').Config} */
// Re-export client's tailwind config but adjust content paths
import clientConfig from "../web-client/tailwind.config.js";

export default {
  ...clientConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../web-client/src/**/*.{js,ts,jsx,tsx}", // Include client files for shared components
  ],
};
