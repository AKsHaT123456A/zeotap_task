import axios from "axios";
import { WeatherData, DailySummary } from "../Interfaces/interfaces.ts";
import { API_KEY } from "../Config/config.ts";
import { determineDominantCondition } from "../Utils/utils.ts";

export async function fetchWeatherData(city: string): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data for ${city}: ${error}`);
    return null;
  }
}

export async function aggregateDailyData(
  city: string,
  dayData: WeatherData[]
): Promise<DailySummary> {
  const temperatureMax = dayData.map((data) => data.temp_max);
  const temperatureMin = dayData.map((data) => data.temp_min);
  const temperatures = dayData.map((data) => data.temp);
  const pressures = dayData.map((data) => data.pressure);
  const humidities = dayData.map((data) => data.humidity);
  const maxTemp = Math.max(...temperatureMax);
  const minTemp = Math.min(...temperatureMin);
  const pressure =
    pressures.reduce((acc, curr) => acc + curr, 0) / pressures.length;
  const humidity =
    humidities.reduce((acc, curr) => acc + curr, 0) / humidities.length;
  const avgTemp =
    temperatures.reduce((acc, curr) => acc + curr, 0) / temperatures.length;
  const windSpeeds = dayData.map((data) => data.wind_speed);
  const avgWindSpeed =
    windSpeeds.reduce((acc, curr) => acc + curr, 0) / windSpeeds.length;

  const dominantCondition = determineDominantCondition(
    dayData.map((data) => data.main)
  );

  return {
    city,
    avgTemp,
    maxTemp,
    minTemp,
    humidity,
    pressure,
    wind_speed: avgWindSpeed,
    dominantCondition,
    date: new Date(),
  };
}