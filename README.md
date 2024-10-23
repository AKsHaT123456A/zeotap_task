# Zeotap Task

This repository contains two applications:

1. **AST Rule Engine**
2. **Weather Monitoring System**

Both applications are built using Node.js with Docker and MongoDB, featuring security enhancements and user-configurable options.

---

## 1. AST Rule Engine

### Overview

The AST (Abstract Syntax Tree) Rule Engine is designed to determine user eligibility based on attributes like age, department, income, etc. Rules are defined in the form of strings and parsed into an AST for evaluation.

### Features

- Dynamic creation and modification of rules.
- Evaluation of user eligibility based on the provided conditions.
- Efficient combination of multiple rules into a single AST structure.
- Error handling for invalid rules and malformed data.

### Setup

#### Prerequisites

- Docker
- Docker Compose

#### Running the Application

1. Clone the repository and navigate to the `ast-rule-engine` directory:

   ```bash
   git clone https://github.com/AKsHaT123456A/zeotap_task.git
   cd zeotap_task/ast-rule-engine
   ```

2. Run the following command to build and start the application using Docker:

   ```bash
   docker-compose up --build
   ```

   This command will spin up:
   - A **Node.js backend** server on port `3000`.
   - A **Vite frontend** client on port `5173`.
   - A **MongoDB instance** on port `27017` for data storage.

#### API Endpoints

- `POST /create_rule`: Create a rule based on the input string and generate the corresponding AST.
- `POST /evaluate_rule`: Evaluate a given rule against user data and determine eligibility.

#### Example AST Representation

For the rule:

```
((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
```

The corresponding AST would look like:

```
                   AND
                 /     \
            OR                OR
          /    \             /    \
      AND      AND       salary > 50000   experience > 5
     /    \     /    \
 age > 30 department= Sales  age < 25 department= Marketing
```

#### Bonus Implementations

- **CORS** and **Helmet** middleware for enhanced security.
- **Logger** for request tracking and error logging.

### Demo

You can watch the demo video for the **AST Rule Engine** [here](#link-to-demo).

---

## 2. Weather Monitoring System

### Overview

The Weather Monitoring System continuously retrieves real-time weather data from the OpenWeatherMap API for various cities in India, processes it, and triggers alerts based on user-configured preferences.

### Features

- Retrieves weather data at regular intervals.
- Converts temperatures from Kelvin to Celsius or Fahrenheit based on user preference.
- Stores daily summaries with aggregates like average, max, and min temperatures.
- Alerts the user when specified conditions (e.g., temperature thresholds) are met.

### Setup

#### Prerequisites

- Docker
- Docker Compose
- OpenWeatherMap API Key

#### Running the Application

1. Clone the repository and navigate to the `weather-monitoring-system` directory:

   ```bash
   git clone https://github.com/AKsHaT123456A/zeotap_task.git
   cd zeotap_task/weather-monitoring-system
   ```

2. Run the following command to build and start the application:

   ```bash
   docker-compose up --build
   ```

3. In a new terminal, run the following to launch the weather monitoring system:

   ```bash
   docker-compose run --rm weather_app
   ```

#### CLI for User Preferences

The system includes a CLI tool to configure user preferences, allowing you to:

- Set the temperature unit (Celsius or Fahrenheit).
- Set a temperature threshold for alerts.
- Set the weather condition (e.g., "Rain") for alerts.

Example prompt:

```
Would you prefer temperature in Celsius (C) or Fahrenheit (F)? 
Enter the temperature threshold for alerts: 
Enter the weather condition for alerts (e.g., Rain, Clear): 
```

#### Bonus Implementations

- **CORS** and **Helmet** middleware for enhanced security.
- **Logger** for request tracking and error logging.
- **CLI for User Preferences**: Allows users to set thresholds for alerts and weather conditions.

### Demo

You can watch the demo video for the **Weather Monitoring System** [here](#link-to-demo).

---

## License

This project is licensed under the MIT License.
