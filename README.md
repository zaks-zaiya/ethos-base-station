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
![ethos drawio (8)](https://github.com/climate-ethos/ethos-raspberry-pi/assets/25999161/208dc64c-523c-4730-874c-582c651a265a)
