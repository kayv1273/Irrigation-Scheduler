import SunCalc from 'suncalc';

var dripRate // Constant drip rate for irrigation system at 15psi (L/h)
var irrigationEfficiency // Estimated irrigation efficiency
var emittersSize // Size of each emitter in cm 

var times = []
var flowSpline

var flowMargin

var originalSunrise
var originalSunset

var sunrise
var sunset

var numberOfIntervals = 23;

const BUFFER = 10; // buffer between zones

class IrrigationValues {
    constructor(zoneID, numberOfRows, lengthOfDripLine, emittersStandard, waterVolume, distanceBetweenDripRows, applicationRatePerHour) {
        this.zoneID = zoneID
        this.numberOfRows = numberOfRows
        this.lengthOfDripLine = lengthOfDripLine
        this.emittersStandard = emittersStandard
        this.waterVolume = waterVolume
        this.distanceBetweenDripRows = distanceBetweenDripRows
        this.applicationRatePerHour = applicationRatePerHour
    }
}

function setIrrigationValues(data) {
    dripRate = data[0][1];
    irrigationEfficiency = data[1][1];
    emittersSize = data[2][1];
}

const createIrrigationValue = ({ zoneID, distanceBetweenDripRows, numberOfRows, lengthOfDripLine }) => {
    const emittersStandard = Math.ceil((lengthOfDripLine * numberOfRows)/(emittersSize / 100));
    const waterVolume = ((dripRate * emittersStandard) / 1000);
    const applicationRatePerHour = ((dripRate * irrigationEfficiency) / (distanceBetweenDripRows * emittersSize)) * 1000;

    return new IrrigationValues(zoneID, numberOfRows, lengthOfDripLine, emittersStandard, waterVolume, distanceBetweenDripRows, applicationRatePerHour);
};

const extractSectionData = (data) => {
    const sectionData = []
    for (let i = 4; i < data.length-3; i = i + 6) {
        const zone = data[i][1];
        const distanceBetweenDripRows = data[i+1][1];
        const numberOfRows = data[i+2][1];
        const lengthOfDripLine = data[i+3][1];

        const dataObject = {
            zoneID: zone, 
            numberOfRows: numberOfRows, 
            lengthOfDripLine: lengthOfDripLine, 
            distanceBetweenDripRows: distanceBetweenDripRows
        }

        sectionData.push(dataObject)
    }
    return sectionData
};

function setSolarValues(data) {
    var efficiency = data[0][1]
    var waterDensity = data[1][1]
    var gravAccel = data[2][1]
    var head = data[3][1]
    flowMargin = data[4][1]
    originalSunrise = data[6][1]
    originalSunset = data[7][1]

    const boosterPump = []
    for (let i = 10; i < data.length; i++) {
        boosterPump.push(data[i][0])
    }

    const flowData = []
    for(let i = 0; i < boosterPump.length; i++) {
        flowData[i] = (((boosterPump[i] * 1000) * efficiency) / (waterDensity * gravAccel * head)) * 3600
    }
    return flowData
}

function getFlow(boosterPump, efficiency, waterDensity, gravAccel, head) {
    const flowData = []
    for(let i = 0; i < boosterPump.length; i++) {
        flowData[i] = (((boosterPump[i] * 1000) * efficiency) / (waterDensity * gravAccel * head)) * 3600
    }
    return flowData
}

class CubicSpline {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.n = x.length;

        this.secondDerivatives = this.computeSecondDerivatives();
    }

    computeSecondDerivatives() {
        const n = this.n;
        const x = this.x;
        const y = this.y;
        const u = new Array(n - 1).fill(0);
        const secondDerivatives = new Array(n).fill(0);

        for (let i = 1; i < n - 1; i++) {
            const sig = (x[i] - x[i - 1]) / (x[i + 1] - x[i - 1]);
            const p = sig * secondDerivatives[i - 1] + 2;
            secondDerivatives[i] = (sig - 1) / p;
            u[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]) - (y[i] - y[i - 1]) / (x[i] - x[i - 1]);
            u[i] = (6 * u[i] / (x[i + 1] - x[i - 1]) - sig * u[i - 1]) / p;
        }
        
        // console.log("Seconds: ", secondDerivatives);

        return secondDerivatives;
    }

    at(xVal) {
        const x = this.x;
        const y = this.y;
        const secondDerivatives = this.secondDerivatives;
        let klo = 0;
        let khi = this.n - 1;

        while (khi - klo > 1) {
            const k = Math.floor((khi + klo) / 2);
            if (x[k] > xVal) khi = k;
            else klo = k;
        }

        const h = x[khi] - x[klo];
        if (h === 0) throw new Error("Invalid input: x values must be distinct.");

        const a = (x[khi] - xVal) / h;
        const b = (xVal - x[klo]) / h;
        const yVal = a * y[klo] + b * y[khi] + ((a ** 3 - a) * secondDerivatives[klo] + (b ** 3 - b) * secondDerivatives[khi]) * (h ** 2) / 6;

        return yVal;
    }
}

function isFlowSufficient(desiredVolume, startTime, endTime) {
    for (let t = startTime; t < endTime; t += 30) { // Every 30 minutes within the range
        if (flowSpline.at(t) < desiredVolume + flowMargin) {
            return false; // Not enough flow
        }
    }
    return true; // Flow is sufficient for the entire interval
}

function splitVolumes(sections) {
    const meanWaterVolume = (sections.reduce((sum, section) => sum + section.waterVolume, 0)) / sections.length;
    
    const highVolume = sections.filter(section => section.waterVolume > meanWaterVolume)
        .map(section => {
            const irrigationValue = createIrrigationValue(section);
            return {
                zoneID: irrigationValue.zoneID,
                waterVolume: irrigationValue.waterVolume,
                applicationRate: irrigationValue.applicationRatePerHour
            };
        });

    const lowVolume = sections.filter(section => section.waterVolume <= meanWaterVolume)
        .map(section => {
            const irrigationValue = createIrrigationValue(section);
            return {
                zoneID: irrigationValue.zoneID,
                waterVolume: irrigationValue.waterVolume,
                applicationRate: irrigationValue.applicationRatePerHour
            };
        });

    return { highVolume, lowVolume };
}

function scheduleIrrigation(volumes, usedIntervals, desiredRates) {
    let schedule = [];

    for (const vol of volumes) {
        let selected = false; // boolean checker to see if a slot was found
        const desiredRateForZone = desiredRates.find(dw => dw.zoneID === vol.zoneID);

        if (!desiredRateForZone || !desiredRateForZone.waterRate) {
            continue; // Skip if there's no desired water rate
        }
        var maxTime = times[times.length-1]

        for (let i = times[0]; i < maxTime; i++) {
            const currentFlow = flowSpline.at(i);

            if ((currentFlow - flowMargin) < vol.waterVolume) {
                continue; // keep checking
            }

            if (currentFlow >= vol.waterVolume) {
                const startTime = i; // starting time in minutes from sunrise
                const totalTime = Math.ceil((desiredRateForZone.waterRate / vol.applicationRate) * 60); // Calculate total time in minutes needed for desired water rate
                const endTime = startTime + totalTime; // Calculate end time in minutes from sunrise

                if (isTimeInUsedIntervals(startTime, endTime, usedIntervals)) {
                    continue; // keep checking if the time doesn't fit in the used times
                }

                if (!isFlowSufficient(desiredRateForZone.waterRate, startTime, endTime)) {
                    continue; // keep checking since the flow is not sufficient throughout the entire time
                }

                const startTimeInHours = timeStringToHoursMinutes(startTime);
                const endTimeInHours = timeStringToHoursMinutes(endTime);

                const adjustedEndTime = endTime + BUFFER;

                usedIntervals.push({ start: startTime, end: adjustedEndTime });

                // Add to the schedule
                schedule.push({
                    zoneID: vol.zoneID,
                    startTime: startTimeInHours,
                    endTime: endTimeInHours,
                    totalTime: totalTime
                });
                selected = true; // slot for zone was found
                break; // Break out of the loop once scheduled
            }
        }
        if (!selected) {
            console.log("Could not find suitable location for zone", vol.zoneID);
        }
    }

    return schedule;
}

function timeStringToHoursMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return formattedTime;
}

function timeStringToHours(stringTimes) {
    const [hoursStr, minutesStr] = stringTimes.split(':');
    
    const hours = parseInt(hoursStr, 10);    // Convert hours to integer
    const minutes = parseInt(minutesStr, 10); // Convert minutes to integer

    const decimalHours = hours + (minutes / 60);

    return decimalHours; // Return the result
}

function isTimeInUsedIntervals(startTime, endTime, usedIntervals) {
    for (const interval of usedIntervals) {
        // Account for BUFFER both before and after an interval
        const bufferedStart = interval.start - BUFFER;
        const bufferedEnd = interval.end + BUFFER;

        if (startTime < bufferedEnd && endTime > bufferedStart) {
            return true; // Overlaps or within BUFFER range
        }
    }
    return false;
}

function generateIrrigationSchedule(sections, desiredRates) {
    var usedIntervals = [];
    var highVolumeSchedule = [];
    var lowVolumeSchedule = [];

    const { highVolume, lowVolume } = splitVolumes(sections);
    
    if (highVolume.length > 0) {
        highVolumeSchedule = scheduleIrrigation(highVolume, usedIntervals, desiredRates);
    } else {
        console.log("No high volume sections to schedule.");
    }
    
    if (lowVolume.length > 0) {
        lowVolumeSchedule = scheduleIrrigation(lowVolume, usedIntervals, desiredRates);
    } else {
        console.log("No low volume sections to schedule.");
    }

    const finalSchedule = [...highVolumeSchedule, ...lowVolumeSchedule];
    
    console.log("Final Irrigation Schedule:", finalSchedule);
    
    localStorage.setItem('irrigationSchedule', JSON.stringify(finalSchedule));
    
    return finalSchedule;
}

function sortTime(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = timeStringToHours(arr[Math.floor(arr.length / 2)].startTime);

    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
        if (i === Math.floor(arr.length / 2)) continue; // skip the pivot
        if (timeStringToHours(arr[i].startTime) < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...sortTime(left), arr[Math.floor(arr.length / 2)], ...sortTime(right)];
}

const convertToTime = (isoString) => {
    const timeConversion = 2;
    const date = new Date(isoString); // Create a Date object from the ISO string
    date.setUTCHours(date.getUTCHours() + timeConversion); // Add the offset (e.g., +2 for UTC+2)

    const hours = date.getUTCHours().toString().padStart(2, '0'); // Get hours and format as 2 digits
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Get minutes and format as 2 digits
    return `${hours}:${minutes}`; // Return time in HH:mm format
};

function calculateIntervalDifferences(sunrise, sunset) {
    const sunriseMinutes = timeStringToHours(sunrise) * 60; // Sunrise in minutes
    const sunsetMinutes = timeStringToHours(sunset) * 60; // Sunset in minutes
    
    const totalMinutes = sunsetMinutes - sunriseMinutes;
    
    const intervalDifference = totalMinutes / numberOfIntervals;
    
    let currentTime = sunriseMinutes;
    times = [];
    for (let i = 0; i < numberOfIntervals; i++) {
        times.push(currentTime);
        currentTime += intervalDifference;
    }
}

function fetchSunTimes(dateValue) {
    const lat = -13.2543;
    const lng = 34.3015;
    const date = dateValue;

    try {
        const sunTimes = SunCalc.getTimes(date, lat, lng);

        return sunTimes;
        } catch (error) {
        console.error("Error fetching sunrise data:", error);
        return null
    }
}

function populateTable(sections) {
    const desiredRates = JSON.parse(localStorage.getItem('zoneData'));

    var irrigationSchedule = generateIrrigationSchedule(sections, desiredRates);

    irrigationSchedule = sortTime(irrigationSchedule);

    const irrigationDataList = [];

    irrigationSchedule.forEach(zone => {
        const data = {
            zoneID: zone.zoneID,
            startTime: zone.startTime,
            stopTime: zone.endTime
        };
        irrigationDataList.push(data);
    });
    console.log("This is the final data: ", irrigationDataList);
    return irrigationDataList;  
}

export function initializeIrrigationSystem(data) {

    const selectedMonth = JSON.parse(localStorage.getItem('month'));
    const selectedDay = JSON.parse(localStorage.getItem('day'));
    const selectedYear = JSON.parse(localStorage.getItem('year'));

    const date = new Date(selectedYear, selectedMonth, selectedDay);

    const sunTimes = fetchSunTimes(date);
    sunrise = convertToTime(sunTimes.sunrise || " ");
    sunset = convertToTime(sunTimes.sunset || " ");

    if (data) {
        setIrrigationValues(data.zoneData);
        const sectionData = extractSectionData(data.zoneData);
        const sections = sectionData.map(createIrrigationValue);

        var flow = setSolarValues(data.solarData);

        calculateIntervalDifferences(sunrise, sunset);
        
        flowSpline = new CubicSpline(times, flow);

        return populateTable(sections);
    } else {
        console.error("Failed to fetch the data. Please check the error logs.");
        return null;
    }
}