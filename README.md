# Irrigation-Scheduler

Deployed Project: https://kayv1273.github.io/Irrigation-Scheduler

## Overview

This project helps generate an irrigation schedule for the farmers at St. Mary's Secondary School for Girls in Malawi, Africa.

The data used for the equation that is generating the schedule can be found and edited here: https://docs.google.com/spreadsheets/d/1h1a0qYki7aZGx8OeDCtUg9nyEaHSwkme4cPaloFoLYs/edit?usp=sharing

## Getting Started

## Set up

1. Clone repository:

```sh
git clone https://github.com/kayv1273/Irrigation-Scheduler
```

2. Install all packages:

```sh
npm install
```

3. Run the server with command in terminal:

```sh
npm start
```

## Resources

- [React Documentation](https://react.dev/learn)

## How To Use
The user will be presented with the a display of the map of the irrigation system with labels for each of the irrigation zones. The user will input the desired amount of water (in cm) for each irrigation zone they would like water. They will then input a date right before the submit button, If no date is entered, the system will use the current date as the default value. The software will then do calculations and create a schedule for the farmers. The schedule will include a row for each zone which data was input for with a start and stop time. The schedule can then be printed and used by the farmers to turn on the faucet of the irrigation zone at the start time and turn that same zone off once the end time is met.


