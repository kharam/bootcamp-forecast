"use strict";

// DOM for button and place holder
const cityInput = document.getElementById("city-input");
const citySearchButton = document.getElementById("city-search-button");
const resultCity = document.getElementById("result-city");
const resultDetail = document.getElementById("current-weather-detail");

// Required place for openweather api
const ApiURL = "https://api.openweathermap.org/data/2.5";
const currentWeatherApiURL = `${ApiURL}/weather`;
const dailyWeatherApiURL = `${ApiURL}/forecast`;
// const dailyWeatherApiURL = `${ApiURL}/forecast/daily`;

// Temporary place holder for api key, and city
const APIKEY = "b003fb9dacba939b22f1106e25ad5a19";

// Add event listener for search
citySearchButton.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("clicked");
});

/**
 * Query current weather. It will return the response.
 *
 * @param {*} city
 */
async function getCurrentWeather(city) {
  const requestUrl = makeQueryURLWithKey(currentWeatherApiURL, {
    q: `${city}`,
    units: "imperial",
  });

  const response = await fetch(requestUrl)
    .then(status)
    .then(json)
    .catch((error) => {
      console.log("Error", error);
      return null;
    });

  return response;
}

/**
 * Return 5 days weather in array. Each day is 9:00 A.M.'s weather
 *
 * @param {*} city
 */
async function getNextFiveDaysForecast(city = "") {
  const requestUrl = makeQueryURLWithKey(dailyWeatherApiURL, {
    q: `${city}`,
  });
  const response = await fetch(requestUrl)
    .then(status)
    .then(json)
    .then((data) => {
      const weathers = [];
      for (let i = 7; i < 40; i += 8) {
        weathers.push(data.list[i]);
      }

      return weathers;
    })
    .catch((error) => {
      console.log("Error", error);
      return null;
    });

  return response;
}

/**
 * Making a qeury with base URL, and parameter. (Need to give api key)
 *
 * @param String baseURL
 * @param Object queryObject
 * @param String apiKey
 */
function makeQueryURLWithKey(baseURL, queryObject, apiKey = APIKEY) {
  const queryObjectCopy = queryObject;

  function makeQueryURL(baseURL, queryObject) {
    // join the query into the string
    const query = Object.keys(queryObject)
      .map((k) => `${escape(k)}=${escape(queryObject[k])}`)
      .join("&");

    return `${baseURL}?${query}`;
  }

  queryObjectCopy.appid = apiKey;
  return makeQueryURL(baseURL, queryObject);
}

async function searchAndDraw(city = "") {
  function drawCurrentWeather(todayWeather) {
    resultCity.textContent = city;
    resultDetail.innerHTML = `
      <h4>temperature: ${todayWeather.temperature} F</h4>
      <h4>humidity: ${todayWeather.humidity} % </h4>
      <h4>wind speed: ${todayWeather.wind} MPH </h4>
      <h4>UV Index: ${todayWeather.uvIndex}  </h4>
    `;
  }
  const todayWeather = await getTodaysWeather(city);
  const nextFiveDaysWeather = await getNextFiveDaysForecast(city);

  drawCurrentWeather(todayWeather);

  console.log(todayWeather);
}

async function getTodaysWeather(city = "") {
  async function getUVIndex(latitude, longitude) {
    const requestURL = makeQueryURLWithKey(`${ApiURL}/uvi`, {
      lat: latitude,
      lon: longitude,
    });
    const data = await fetch(requestURL)
      .then(status)
      .then(json)
      .then((data) => data.value)
      .catch((error) => {
        console.log(error, "uv_index not known");
        return "";
      });
    return data;
  }
  const todayWeather = await getCurrentWeather(city);
  const latitude = todayWeather.coord.lat;
  const longitude = todayWeather.coord.lon;
  const uvIndex = await getUVIndex(latitude, longitude);
  const temperature = todayWeather.main.temp_max;
  const humidity = todayWeather.main.humidity;
  const wind = todayWeather.wind.speed;
  const weather = todayWeather.weather[0];
  const description = weather.description;
  const icon = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;
  const weatherTitle = weather.main;
  // temperature, humidity wind uv index

  const weatherObject = {
    weather: weatherTitle,
    temperature: temperature,
    uvIndex: uvIndex,
    humidity: humidity,
    wind: wind,
    description: description,
    icon: icon,
  };

  return weatherObject;
}

function makeDailyWeatherCard(date, weather, temperature, humidity) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img class="card-img-top" src="http://openweathermap.org/img/wn/10d@4x.png" alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">
        date: ${date}
        weather: ${weather}
        temperature: ${temperature}
        humidity: ${humidity}
      </p>
    </div>
  `;

  return card;
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

searchAndDraw("seattle");
const cardGroup = document.getElementById("five-days-weather");
cardGroup.innerHTML = "";
// cardGroup.innerHTML = makeDailyWeatherCard(12, 32, 32, 23);
const test = makeDailyWeatherCard(12, 32, 32, 23);
const test1 = makeDailyWeatherCard(12, 32, 32, 23);
// console.log(test);
cardGroup.appendChild(test);
cardGroup.appendChild(test1);
