// "use strict";

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
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error("City name not known from the api");
    })
    .then((data) => {
      // Draw current weather to DOM
    })
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
  function makeQueryURL(baseURL, queryObject) {
    // join the query into the string
    const query = Object.keys(queryObject)
      .map((k) => `${escape(k)}=${escape(queryObject[k])}`)
      .join("&");

    return `${baseURL}?${query}`;
  }

  queryObject["appid"] = apiKey;
  return makeQueryURL(baseURL, queryObject);
}

function searchAndDraw(city = "") {
  getCurrentWeather(city);
  getNextFiveDaysForecast(city);
}

searchAndDraw("seattle");
