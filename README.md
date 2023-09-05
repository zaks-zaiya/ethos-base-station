# Contents

- [Tips](#tips)
  * [Show settings button](#show-settings-button)
- [Installation and building](#installation-and-building)
  * [Development build](#development-build)
  * [Production build](#production-build)
- [Testing](#testing)
  * [Unit testing](#unit-testing)
  * [End-to-end testing](#end-to-end-testing)
- [Application data structure](#application-data-structure)
  * [Data flow diagram](#data-flow-diagram)
  * [Database types](#database-types)
    + [Sensor](#sensor)
    + [Weather](#weather)
    + [Preferences](#preferences)
    + [Survey](#survey)
    + [Alert](#alert)

# Tips

## Show settings button

To show the settings button, press the ethos logo (top left) 7 times in quick succession

# Installation and building

## Development build

*Requirements: NPM, Yarn, Python 3.9 (with venv) and Docker*

1. Ensure Docker is open and running
2. Under `./javascript_ui` make a file named `.env` using the provided `.env.example` file and fill in all variables
3. Run install script `sh dev_install.sh` (Mac/Linux) or `.\dev_install.bat` (Windows)
4. To run development build run `sh dev_run.sh` (Mac/Linux) or `.\dev_run.bat` (Windows)

Note: If you get an error `CouchDB did not start in time` or `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`, make sure docker is running, either by launching the application or by running `sudo systemctl start docker` (Linux).

## Production build

*Requirements: NPM, Yarn and Python 3.9 (with venv)*

To run production build:

1. Build production binary and install dependencies by running `sh pi_install_build.sh` (Pi)
2. Run executable with `sh pi_run.sh` (Pi)

# Testing

## Unit testing

*Requirements: NPM, Yarn and Python 3.9 (with venv)*

1. Run executable with `sh dev_tests_unit.sh` (Mac/Linux)

## End-to-end testing

*Requirements: NPM, Yarn, Python 3.9 (with venv) and Docker*

1. Run executable with `sh dev_tests_e2e.sh` (Mac/Linux)

# Application data structure

## Data flow diagram

![ethos-data-flow](https://github.com/climate-ethos/ethos-raspberry-pi/assets/25999161/d875d1a4-6194-4e35-b54b-a58411adab3e)

Each data type shown in the diagram is explained below:

## Database types

Definitions for the structure can be found in `javascript_ui/src/typings/database-types.d.ts`. Each row in the database corresponds to a historical record of one of the following types:

### Sensor

```{ .json }
{
  type: 'sensor';
  time: Date;
  userId: string;
  sensorLocation: string | undefined;
  sensorId: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
}
```

### Weather

```{ .json }
{
  type: 'weather';
  time: Date;
  userId: string;
  weatherLocation: string | null;
  temperature: number | null;
  humidity: number | null;
}
```

### Preferences

```{ .json }
{
  type: 'preferences';
  time: Date;
  userId: string;
  audioType: AudioType;
  isFollowUp: boolean;
  coolingStrategyOptions: Array<{
    key: string;
    haveAccessTo: boolean;
    wouldUse: boolean;
    whyNotUse: Array<string>;
    whyNotUseOther: string;
  }>;
}
```

### Survey

```{ .json }
{
  type: 'survey';
  time: Date;
  userId: string;
  TODO
}
```

### Alert

```{ .json }
{
  type: 'alert';
  time: Date;
  userId: string;
  riskLevel: RiskLevel | undefined;
  volumePercent: number;
  dismissMethod: null | 'not here' | 'cooling strategies' | 'dismiss';
}
```
