# ethos-raspberrypi

## Show settings button

To show the settings button, press the ethos logo (top left) 7 times in quick succession

## Installation

Requirements: NPM and Python 3 (with venv) to be previously installed

1. Run install script `sh install.sh` (Mac/Linux) or `.\install.bat` (Windows)
2. Under `./javascript_ui` make a file named `.env` using the provided `.env.example` file and fill in all variables

## Run dev build

To run development build run `sh run_dev.sh` (Mac/Linux) or `.\run_dev.bat` (Windows)

## Run prod build

To run production build:

1. Build production binary by running `sh run_build.sh`
2. Run executable with `sh run_prod.sh` (Linux)
