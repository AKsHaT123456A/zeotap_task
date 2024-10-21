import * as readline from "readline";

export let userThresholds = {
  temperature: 35,
  condition: "Rain",
};

export let tempUnit = "C"; // Default unit is Celsius

export function askUserPreferences(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "Would you prefer temperature in Celsius (C) or Fahrenheit (F)? ",
      (unit) => {
        if (unit.toUpperCase() === "F") {
          tempUnit = "F";
        }

        rl.question("Enter the temperature threshold for alerts: ", (temp) => {
          userThresholds.temperature = parseFloat(temp);
          rl.question(
            "Enter the weather condition for alerts (e.g., Rain, Clear): ",
            (condition) => {
              userThresholds.condition = condition;
              rl.close();
              resolve();
            }
          );
        });
      }
    );
  });
}

export function convertKelvinToCelsius(tempK: number): number {
  return tempK - 273.15;
}

export function convertCelsiusToFahrenheit(tempC: number): number {
  return (tempC * 9) / 5 + 32;
}

export function formatTemperature(tempC: number): number {
  return tempUnit === "F" ? convertCelsiusToFahrenheit(tempC) : tempC;
}

export function determineDominantCondition(conditions: string[]): string {
  const conditionCount: { [key: string]: number } = {};
  conditions.forEach((condition) => {
    conditionCount[condition] = (conditionCount[condition] || 0) + 1;
  });
  return Object.keys(conditionCount).reduce((a, b) =>
    conditionCount[a] > conditionCount[b] ? a : b
  );
}