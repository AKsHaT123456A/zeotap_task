import { WeatherData } from "../Interfaces/interfaces.ts";
import { formatTemperature, userThresholds, tempUnit } from "../Utils/utils.ts";

export function triggerAlerts(currentWeather: WeatherData) {
  const formattedTemp = formatTemperature(currentWeather.temp);

  // ANSI escape code for red text
  const redText = "\x1b[31m";
  const resetText = "\x1b[0m";

  if (formattedTemp > userThresholds.temperature) {
    console.warn(
      `${redText}ALERT! ${currentWeather.city} temperature exceeded ${userThresholds.temperature}${tempUnit}${resetText}`
    );
  }
  if (currentWeather.main === userThresholds.condition) {
    console.warn(
      `${redText}ALERT! ${currentWeather.city} is experiencing ${userThresholds.condition}${resetText}`
    );
  }
}