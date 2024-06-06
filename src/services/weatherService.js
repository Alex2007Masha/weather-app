import { DateTime } from "luxon"; // Importing DateTime class from luxon library

const API_KEY = '1217cdf19ea329cfb2f6e7e376ec8948'; // OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/'; // Base URL for OpenWeatherMap API

const getWeatherData = (infoType, searchParams) => {
    const url = new URL(BASE_URL + infoType); // Constructing the URL for the specific weather information
    url.search = new URLSearchParams({ ...searchParams, appid: API_KEY }); // Appending search parameters to the URL
    console.log(url); // Logging the URL
    return fetch(url).then((res) => res.json()); // Fetching the weather data and parsing it as JSON
};

const iconUrlFromCode = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`; // Function to get the URL for the weather icon

const formatToLocalTime = 
    (secs, 
     offset, 
     format = "cccc, dd, LLL, yyyy '| Local time:' hh:mm a"
    ) => DateTime.fromSeconds(secs + offset, { zone: 'utc' }).toFormat(format); // Function to format a timestamp to local time

const formatCurrent = (data) => {
    // Destructuring the required weather data from the response
    const {
        coord: { lat, lon },
        main: { temp, feels_like, temp_min, temp_max, humidity },
        name,
        dt,
        sys: { country, sunrise, sunset },
        weather,
        wind: { speed },
        timezone,
    } = data;

    const { main: details, icon } = weather[0]; // Destructuring weather details
    const formattedLocalTime = formatToLocalTime(dt, timezone); // Formatting the local time

    return {
        temp,
        feels_like,
        temp_min,
        temp_max,
        humidity,
        name,
        country,
        sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'), // Formatting sunrise time
        sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'), // Formatting sunset time
        speed,
        details,
        icon: iconUrlFromCode(icon), // Getting icon URL
        formattedLocalTime,
        dt,
        timezone,
        lat,
        lon
    };
};

const formatForecastWeather = (secs, offset, data) => {
    // Filtering hourly and daily forecast for weather data
    const hourly = data.filter(f => f.dt > secs).map(f => ({
        temp: f.main.temp,
        title: formatToLocalTime(f.dt, offset, 'hh:mm a'),
        icon: iconUrlFromCode(f.weather[0].icon),
        data: f.dt_txt,
    })).slice(0, 5);

    const daily = data.filter((f) => f.dt_txt.slice(-8) === '00:00:00').map(f => ({
        temp: f.main.temp,
        title: formatToLocalTime(f.dt, offset, 'ccc'),
        icon: iconUrlFromCode(f.weather[0].icon),
        data: f.dt_txt,
    }));

    return { hourly, daily }; // Returning formatted hourly and daily forecast
};

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        'weather',
        searchParams
    ).then(formatCurrent); // Getting and formatting current weather data

    // Destructuring necessary data from current weather for forecast
    const { dt, lat, lon, timezone } = formattedCurrentWeather;

    const formattedForecastWeather = await getWeatherData('forecast', {
        lat,
        lon,
        units: searchParams.units,
    }).then((d) => formatForecastWeather(dt, timezone, d.list)); // Getting and formatting forecast weather data

    return { ...formattedCurrentWeather, ...formattedForecastWeather }; // Combining current and forecast weather data
};

export default getFormattedWeatherData; // Exporting the function to get formatted weather data

