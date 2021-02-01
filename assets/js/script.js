"use strict";

const ApiURL = "https://api.openweathermap.org/data/2.5";
const currentWeatherApiURL = `${ApiURL}/weather`;
const dailyWeatherApiURL = `${ApiURL}/daily`;

const apiKey = "b003fb9dacba939b22f1106e25ad5a19";
const city = "seattle";

async function getCurrentWeather() {
  const requestUrl = `${currentWeatherApiURL}?q=${city}&appid=${apiKey}`;

  await fetch(requestUrl)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
    });
}

async function getNextFiveDaysForecast() {}

function makeQueryURLWithKey(baseURL, queryObject) {
  queryObject["appid"] = apiKey;
  return makeQueryURL(baseURL, queryObject);
}

function makeQueryURL(baseURL, queryObject) {
  // join the query into the string
  const query = Object.keys(queryObject)
    .map((k) => `${escape(k)}=${escape(queryObject[k])}`)
    .join("&");

  return `${baseURL}?${query}`;
}

// getCurrentWeather();
const temp = makeQueryURLWithKey(currentWeatherApiURL, {
  name: "hi",
  kwon: "good",
});

console.log(temp);
