import * as url from "url";
import { MongoClient } from "mongodb";

export const __dirname = url.fileURLToPath(new URL("../", import.meta.url));
export const API_KEY = "5a0b4bffc5c9fe4225dbe6107d3a8eae";
export const CITIES = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];
export const MONGODB_URI = "mongodb://localhost:27017/";
export const client = new MongoClient(MONGODB_URI);
export const dbName = "weather_data";