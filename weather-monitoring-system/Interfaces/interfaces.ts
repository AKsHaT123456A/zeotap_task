export interface WeatherData {
    city: string;
    temp: number;
    feels_like: number;
    temp_min: number;
    pressure: number;
    temp_max: number;
    main: string;
    humidity: number;
    wind_speed: number;
    date: Date;
  }
  
  export interface DailySummary {
    wind_speed: number;
    city: string;
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    pressure: number;
    dominantCondition: string;
    date: Date;
  }