import * as fs from "fs";
import * as path from "path";
import { __dirname } from "../Config/config.ts";
import { DailySummary } from "../Interfaces/interfaces.ts";
import { formatTemperature, tempUnit } from "../Utils/utils.ts";

export async function createTextFile(dailySummaries: DailySummary[]) {
  const filePath = path.join(
    __dirname,
    `weather_summary_${new Date().toISOString().slice(0, 10)}.txt`
  );
  const writeStream = fs.createWriteStream(filePath);

  writeStream.write(`Daily Weather Summary\n`);
  writeStream.write(`=====================\n\n`);
  dailySummaries.forEach((summary, _index) => {
    const avgTemp = formatTemperature(summary.avgTemp);
    const maxTemp = formatTemperature(summary.maxTemp);
    const minTemp = formatTemperature(summary.minTemp);

    writeStream.write(`City: ${summary.city}\n`);
    writeStream.write(
      `Average Temperature: ${avgTemp.toFixed(5)} ${tempUnit}\n`
    );
    writeStream.write(`Max Temperature: ${maxTemp.toFixed(5)} ${tempUnit}\n`);
    writeStream.write(`Min Temperature: ${minTemp.toFixed(5)} ${tempUnit}\n`);
    writeStream.write(`Dominant Condition: ${summary.dominantCondition}\n`);
    writeStream.write(`---------------------\n`);
  });

  writeStream.end();
  console.log("Text file report created successfully.");
}