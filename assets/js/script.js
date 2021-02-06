"use strict";

// DOM for button and place holder
const cityInput = document.getElementById("city-input");
const citySearchButton = document.getElementById("city-search-button");
const resultCity = document.getElementById("result-city");
const resultDetail = document.getElementById("current-weather-detail");
const cardGroup = document.getElementById("five-days-weather");
const historyList = document.getElementById("history-list");

// Required place for openweather api
const ApiURL = "https://api.openweathermap.org/data/2.5";
const currentWeatherApiURL = `${ApiURL}/weather`;
const dailyWeatherApiURL = `${ApiURL}/forecast`;

// Temporary place holder for api key, and city
const APIKEY = "b003fb9dacba939b22f1106e25ad5a19";

// place holder for history
let history = [];

// Add event listener for search
citySearchButton.addEventListener("click", (event) => {
  event.preventDefault();

  // make search only works on year make search
  if (cityInput.value !== "") {
    // save history
    saveHistory(cityInput.value);

    // Draw the city weather on canvas
    searchAndDraw(cityInput.value);
  }
});

historyList.addEventListener("click", (event) => {
  event.preventDefault();
  const keyword = event.target.textContent;
  searchAndDraw(keyword);
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
      // console.log("error here");
      return "";
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
    units: "imperial",
  });
  const response = await fetch(requestUrl)
    .then(status)
    .then(json)
    .then((data) => {
      const weathers = [];
      for (let i = 7; i < 40; i += 8) {
        const JSON = data.list[i];
        const date = JSON.dt_txt.split(" ")[0];
        const weather = JSON.weather[0].main;
        const weatherDescription = JSON.weather[0].description;
        const icon = `http://openweathermap.org/img/wn/${JSON.weather[0].icon}@4x.png`;
        const temp = JSON.main.temp;
        const humidity = JSON.main.humidity;

        const weatherObject = {
          date: date,
          weather: weather,
          weatherDescription: weatherDescription,
          icon: icon,
          temperature: temp,
          humidity: humidity,
        };

        weathers.push(weatherObject);
      }

      return weathers;
    })
    .catch((error) => {
      // console.log("Error", error);
      // console.log("hi");
      return "";
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
    // console.log(`city: ${city}`);
    if (todayWeather === "") resultDetail.innerHTML = "Not Found";
    else {
      resultDetail.innerHTML = `
      <h4>temperature: ${todayWeather.temperature} F</h4>
      <h4>humidity: ${todayWeather.humidity} % </h4>
      <h4>wind speed: ${todayWeather.wind} MPH </h4>
      <h4>UV Index: ${todayWeather.uvIndex}  </h4>
    `;
    }
  }
  function drawNextFiveWeather(weatherList) {
    cardGroup.innerHTML = "";
    if (weatherList !== "") {
      weatherList.forEach((weather) => {
        const weatherCard = makeDailyWeatherCard(weather);
        cardGroup.appendChild(weatherCard);
      });
    }
  }
  const todayWeather = await getTodaysWeather(city);
  const nextFiveDaysWeather = await getNextFiveDaysForecast(city);

  drawCurrentWeather(todayWeather);
  drawNextFiveWeather(nextFiveDaysWeather);
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
        // console.log(error, "uv_index not known");
        return "";
      });
    return data;
  }
  const todayWeather = await getCurrentWeather(city);

  // If today's weather is not returned
  if (todayWeather === "") return "";

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

function makeDailyWeatherCard(weather) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img class="card-img-top" src="${weather.icon}" alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">
        date: ${weather.date}
        weather: ${weather.weather}
        temperature: ${weather.temperature}
        humidity: ${weather.humidity}
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

function loadHistory() {
  history = JSON.parse(localStorage.getItem("history"));

  // if history is null, set the history to empty array
  if (history === null) history = [];
  else {
    drawHistory();
    searchAndDraw(history[0]);
  }
}

function saveHistory(keyword) {
  // clear history, and load history again
  if (history.includes(keyword)) {
    const index = history.indexOf(keyword);
    history.splice(index, 1);
  }
  history.unshift(keyword);

  // If length is longer than 8, reduce to 8
  while (history.length > 8) {
    history.pop();
  }

  // Load the history on the screen
  drawHistory();

  // Save the new history
  localStorage.setItem("history", JSON.stringify(history));
}

function drawHistory() {
  // clear the history, and redraw the history
  historyList.innerHTML = "";
  history.forEach((keyword) => {
    const key = document.createElement("button");
    key.classList.add("btn");
    key.classList.add("previous_search");
    key.textContent = keyword;
    historyList.appendChild(key);
  });
}

loadHistory();
