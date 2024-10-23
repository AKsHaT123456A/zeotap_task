import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ChartConfiguration } from "chart.js";
import * as path from "path";
import * as fs from "fs";
import { __dirname, client, dbName } from "../Config/config.ts";
import { DailySummary } from "../Interfaces/interfaces.ts";
import { formatTemperature, tempUnit } from "../Utils/utils.ts";


let lineSummary=await getDailySummary();
export async function visualizeData(dailySummaries: DailySummary[]) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 1400,
    height: 800,
    backgroundColour: "white",
  });

  // Data for temperature chart
  const cities = dailySummaries.map((summary) => summary.city);
  const avgTemps = dailySummaries.map((summary) =>
    formatTemperature(summary.avgTemp)
  );
  const maxTemps = dailySummaries.map((summary) =>
    formatTemperature(summary.maxTemp)
  );
  const minTemps = dailySummaries.map((summary) =>
    formatTemperature(summary.minTemp)
  );

  // Data for humidity, wind speed, and pressure chart
  const humidity = dailySummaries.map((summary) => summary.humidity);
  const pressure = dailySummaries.map((summary) => summary.pressure);
  const windSpeeds = dailySummaries.map((summary) => summary.wind_speed);

  // Temperature chart configuration
  const tempConfig: ChartConfiguration<"bar"> = {
    type: "bar",
    data: {
      labels: cities,
      datasets: [
        {
          label: `Average Temperature (${tempUnit})`,
          data: avgTemps,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: `Max Temperature (${tempUnit})`,
          data: maxTemps,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: `Min Temperature (${tempUnit})`,
          data: minTemps,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: `Temperature (${tempUnit})`,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Temperature Summary for Cities (${tempUnit})`,
        },
      },
    },
  };

  // Humidity, Wind Speed, and Pressure chart configuration
  const otherMetricsConfig: ChartConfiguration<"bar"> = {
    type: "bar",
    data: {
      labels: cities,
      datasets: [
        {
          label: "Humidity (%)",
          data: humidity,
          backgroundColor: "rgba(255, 206, 86, 0.6)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Wind Speed (m/s)",
          data: windSpeeds,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "Pressure (hPa)",
          data: pressure,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Values",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Humidity, Wind Speed, and Pressure Summary for Cities",
        },
      },
    },
  };

// Average temperature trends line chart configuration
const avgTempTrendsConfig: ChartConfiguration<"line"> = {
  type: "line",
  data: {
    labels: lineSummary.map((summary) => new Date(summary.date).toISOString().split("T")[0]),
    datasets: cities.map((city) => {
      const cityData = dailySummaries.filter((summary) => summary.city === city);
      return {
        label: city,
        data: cityData.map((summary) => formatTemperature(summary.avgTemp)),
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.1,
      };
    }),
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limit the number of ticks to avoid overlap
        },
      },
      y: {
        title: {
          display: true,
          text: `Average Temperature (${tempUnit})`,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Average Temperature Trends for Cities",
      },
    },
  },
};


  try {
    // Render temperature chart
    const tempImage = await chartJSNodeCanvas.renderToBuffer(tempConfig);
    const tempFilePath = path.join(
      __dirname,
      `temperature_summary_${new Date().toISOString().slice(0, 10)}.png`
    );
    
    fs.writeFileSync(tempFilePath, tempImage);

    // Render humidity, wind speed, and pressure chart
    const otherMetricsImage = await chartJSNodeCanvas.renderToBuffer(
      otherMetricsConfig
    );
    const otherMetricsFilePath = path.join(
      __dirname,
      `other_metrics_summary_${new Date().toISOString().slice(0, 10)}.png`
    );
    fs.writeFileSync(otherMetricsFilePath, otherMetricsImage);

    // Render average temperature trends chart
    const avgTempTrendsImage = await chartJSNodeCanvas.renderToBuffer(avgTempTrendsConfig);
    const avgTempTrendsFilePath = path.join(
      __dirname,
      `avg_temperature_trends_${new Date().toISOString().slice(0, 10)}.png`
    );
    fs.writeFileSync(avgTempTrendsFilePath, avgTempTrendsImage);
  } catch (error) {
    console.error("Error generating charts:", error);
  }
}

// Helper function to generate random colors for chart lines
function getRandomColor(): string {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
}

async function getDailySummary() {
  const db = client.db(dbName);
  const collection = db.collection("summaries");
  return await collection.find({}).toArray();
}