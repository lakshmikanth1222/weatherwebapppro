# Weather App

A small, client-side weather dashboard that fetches current conditions, hourly and daily forecasts, air quality, and basic astronomy data from WeatherAPI.com. It includes animated backgrounds (sun, clouds, rain, snow, stars) and a geolocation button to fetch weather for the user's current location.

## Features

- Current weather (temperature, condition, feels-like, humidity, wind, pressure, visibility, UV, precipitation, cloud cover)
- Air Quality (AQI + pollutant concentrations, when available)
- Astronomy (sunrise, sunset, moonrise, moonset, moon phase & illumination)
- Hourly forecast (next 24 hours)
- Daily forecast (next 7 days)
- Animated backgrounds and weather effects
- Search by city name or use your device location

## Files

- `index.html` — main HTML file
- `styles.css` — app styles and background/animation styles
- `script.js` — main JavaScript (API calls, DOM updates, animations)

## Quick start

1. Get a free API key from WeatherAPI: https://www.weatherapi.com/
2. Open `script.js` and replace the `API_KEY` value at the top of the file with your key:

   const API_KEY = "YOUR_WEATHERAPI_KEY"; // Replace with your WeatherAPI key

   The file is located at: `script.js` (near the top of the file).

3. Run a local server and open the app in your browser (recommended so geolocation works properly):

   - Using Python 3 (PowerShell):

     ```powershell
     py -m http.server 5500
     # or
     python -m http.server 5500
     ```

   - Open http://localhost:5500 in your browser.

   - Alternatively, use VS Code Live Server extension or any static file server.

Note: Browser geolocation requires a secure context (HTTPS) or localhost. Serving the files from `file://` may prevent geolocation and/or API fetches from working correctly.

## Usage

- Search: Type a city name in the search box and press Enter or click the search button.
- Location: Click the location button to get weather for your device's coordinates (browser permission required).
- Default: On first load the app fetches weather for "New York" (changeable in `script.js`).

## Units

- Temperatures and forecast values are displayed in Celsius (°C). Wind speed uses km/h. If you want Fahrenheit or different units, modify the API calls and DOM value formatting inside `script.js`.

## Security & Deployment notes

- The API key is stored directly in `script.js`. That is fine for local testing, but embedding API keys in client-side code exposes them to anyone who inspects the site. For production, consider one of these options:
  - Create a small server-side proxy that stores the key securely and forwards requests.
  - Move the key into a build-time environment variable and avoid committing it to source control.
  - Use a `config.js` file that's kept out of version control (add it to `.gitignore`) and load it before `script.js`.

## Troubleshooting

- If the app shows "City not found or data unavailable":
  - Verify the API key is correct and not rate-limited.
  - Check your network and WeatherAPI service status.

- If geolocation fails:
  - Ensure you served the site over `localhost` or `https`.
  - Make sure the browser has permission to access location.

- If fetch requests are blocked by CORS or blocked when opening via `file://`:
  - Run a local server (see Quick start) or deploy to a static host.

## Development / Customization ideas

- Add unit toggles (°C/°F) and persist preference in localStorage.
- Move API calls to a small back-end to hide the API key.
- Add error handling for partial API responses (missing air quality or astronomy data).
- Add tests for the data-processing functions.

## Contribution

1. Fork the repo
2. Create a branch for your feature/fix
3. Open a pull request with a short description of the change

## Credits

- Weather data: WeatherAPI.com

## License

This project is provided as-is. Add a license if you want to open-source it (MIT is common for small projects).

---

If you'd like, I can also:

- add a `config.example.js` and update `index.html` with instructions to load it before `script.js`, or
- add a small server proxy example (Node/Express) to keep the API key secret.

Tell me which extra you'd prefer and I'll create it.
