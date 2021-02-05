"use strict";

// Required place for openweather api
const ApiURL = "https://api.openweathermap.org/data/2.5";
const currentWeatherApiURL = `${ApiURL}/weather`;
const dailyWeatherApiURL = `${ApiURL}/forecast`;
// const dailyWeatherApiURL = `${ApiURL}/forecast/daily`;

// Temporary place holder for api key, and city
const APIKEY = "b003fb9dacba939b22f1106e25ad5a19";

/**
 * Query current weather. It will return the response.
 *
 * @param {*} city
 */
async function getCurrentWeather(city) {
  const requestUrl = makeQueryURLWithKey(currentWeatherApiURL, {
    q: `${city}`,
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
 *
 * @param {*} city
 */
async function getNextFiveDaysForecast(city = "") {
  const requestUrl = makeQueryURLWithKey(dailyWeatherApiURL, {
    q: `${city}`,
  });
  const response = await fetch(requestUrl)
    .then((response) => {
      if (response.ok) return response.json;
      else throw new Error("city name or server problem");
    })
    .then((data) => {
      // Draw five days weather doms
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
  const todayWeather = await getCurrentWeather(city);
  console.log(todayWeather);
  getNextFiveDaysForecast(city);
}

function makeDailyWeatherCard(date, weather, temperature, humidity) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img class="card-img-top" src="..." alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">
        date: ${date}
        weather: ${weather}
        temperature: ${temperature}
        humidity: ${humidity}
      </p>
    </div>
    <div class="card-footer">
      <small class="text-muted">Last updated 3 mins ago</small>
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
// const test = makeDailyWeatherCard(12, 32, 32, 23);
// const test1 = makeDailyWeatherCard(12, 32, 32, 23);
// console.log(test);
// cardGroup.appendChild(test);
// cardGroup.appendChild(test1);
