import * as schedule from "node-schedule";
import { CITIES, client, dbName } from "./Config/config.ts";
import { askUserPreferences, convertKelvinToCelsius } from "./Utils/utils.ts";
import { fetchWeatherData, aggregateDailyData } from "./Services/weather.service.ts";
import { triggerAlerts } from "./Services/alert.service.ts";
import { visualizeData } from "./Services/visualization.service.ts";
import { createTextFile } from "./Services/file.service.ts";
import { WeatherData, DailySummary } from "./Interfaces/interfaces.ts";

async function storeDailySummary(summary: DailySummary) {
  const db = client.db(dbName);
  const collection = db.collection("summaries");
  await collection.insertOne(summary);
  console.log(`Stored daily summary for ${summary.city} in MongoDB`);
}

async function startWeatherMonitoring() {
  await client.connect();
  await askUserPreferences(); // Get user preferences for temperature unit and thresholds
  const getWeather = async () => {
    const dailyWeatherData: WeatherData[] = [];

    try {
      for (const city of CITIES) {
        const data = await fetchWeatherData(city);
        if (data) {
          const tempCelsius = convertKelvinToCelsius(data.main.temp);
          const weatherData: WeatherData = {
            city,
            temp: tempCelsius,
            feels_like: convertKelvinToCelsius(data.main.feels_like),
            temp_min: convertKelvinToCelsius(data.main.temp_min),
            temp_max: convertKelvinToCelsius(data.main.temp_max),
            main: data.weather[0].main,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            date: new Date(),
            pressure: data.main.pressure / 10,
          };

          dailyWeatherData.push(weatherData);

          // Trigger alerts based on the current weather data
          triggerAlerts(weatherData);
        }
      }

      // Aggregate daily data for each city
      const citySummaries: DailySummary[] = [];
      for (const city of CITIES) {
        const cityData = dailyWeatherData.filter((data) => data.city === city);
        if (cityData.length > 0) {
          const summary = await aggregateDailyData(city, cityData);
          citySummaries.push(summary);
          await storeDailySummary(summary);
        }
      }

      // Create a text file with the summary of the weather data
      await createTextFile(citySummaries);

      // Optionally, visualize the data and save the chart as an image
      await visualizeData(citySummaries);
    } catch (error) {
      console.error("Error during weather monitoring:", error);
    }
  };

  schedule.scheduleJob("*/5 * * * * * * *", getWeather);

  // Run the monitoring immediately on startup
  await getWeather();
}

startWeatherMonitoring().catch(console.error);