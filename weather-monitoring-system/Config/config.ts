import * as url from "url";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export const __dirname = url.fileURLToPath(new URL("../", import.meta.url));
export const API_KEY =process.env.API_KEY;

export const CITIES = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];
export const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
export const client = new MongoClient(MONGODB_URI);
export const dbName = "weather_data";