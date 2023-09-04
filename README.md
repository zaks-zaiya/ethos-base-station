# ethos-raspberrypi

## Show settings button

To show the settings button, press the ethos logo (top left) 7 times in quick succession

## Development build

Requirements: NPM, Yarn, Python 3.9 (with venv) and Docker

1. Ensure Docker is open and running
2. Under `./javascript_ui` make a file named `.env` using the provided `.env.example` file and fill in all variables
3. Run install script `sh dev_install.sh` (Mac/Linux) or `.\dev_install.bat` (Windows)
4. To run development build run `sh dev_run.sh` (Mac/Linux) or `.\dev_run.bat` (Windows)

Note: If you get an error `CouchDB did not start in time` or `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`, make sure docker is running, either by launching the application or by running `sudo systemctl start docker` (linux).

## Production build

Requirements: NPM, Yarn and Python 3.9 (with venv)

To run production build:

1. Build production binary and install dependencies by running `sh pi_install_build.sh` (Pi)
2. Run executable with `sh pi_run.sh` (Pi)

## Run tests

1. Run executable with `sh dev_tests.sh` (Mac/Linux/Pi)

## Data Structure

The overall data structure and flow of the application is as follows:
![ethos-data-flow](https://github.com/climate-ethos/ethos-raspberry-pi/assets/25999161/c520cee3-ded9-4c9c-98d3-66fe885b14e8)

Where each data type is represented by the JSON object specified below. Definitions for the structure can be found in `javascript_ui/src/typings/database-types.d.ts`.

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
