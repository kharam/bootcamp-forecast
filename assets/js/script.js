"use strict";

// Required place for openweather api
const ApiURL = "https://api.openweathermap.org/data/2.5";
const currentWeatherApiURL = `${ApiURL}/weather`;
const dailyWeatherApiURL = `${ApiURL}/forecast/daily`;

// Temporary place holder for api key, and city
const APIKEY = "b003fb9dacba939b22f1106e25ad5a19";

async function getCurrentWeather(city) {
  const requestUrl = makeQueryURLWithKey(currentWeatherApiURL, {
    q: `${city}`,
  });

  await fetch(requestUrl)
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
    });
}

async function getNextFiveDaysForecast(city, cnt) {
  const requestUrl = makeQueryURLWithKey(dailyWeatherApiURL, {
    q: `${city}`,
    cnt: `${cnt}`,
  });

  console.log(requestUrl);
  await fetch(requestUrl)
    .then((response) => response.json)
    .then((data) => console.log(data));
}

/**
 * Making a qeury with base URL, and parameter. (Need to give api key)
 *
 * @param String baseURL
 * @param Object queryObject
 * @param String apiKey
 */
const makeQueryURLWithKey = function (baseURL, queryObject, apiKey = APIKEY) {
  function makeQueryURL(baseURL, queryObject) {
    // join the query into the string
    const query = Object.keys(queryObject)
      .map((k) => `${escape(k)}=${escape(queryObject[k])}`)
      .join("&");

    return `${baseURL}?${query}`;
  }

  queryObject["appid"] = apiKey;
  return makeQueryURL(baseURL, queryObject);
};

// getCurrentWeather("seattle");
getNextFiveDaysForecast("seattle", 7);
