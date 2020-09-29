const apiKey = 'e3f6a0309642eadf96ccbe3919f2c494'
const url = 'https://api.openweathermap.org/'
const out = document.getElementById('container')
const form = document.getElementById('form')

form.addEventListener('submit', getWeatherByCity)

function getWeatherByCity(event) {
  event.preventDefault()

  const city = document.getElementById('input').value

  if (!city) {
    return false
  }

  const weather = `${url}data/2.5/weather?q=${city}&appid=${apiKey}`
  const forecast = `${url}data/2.5/forecast?q=${city}&appid=${apiKey}`

  Promise.all([fetch(weather), fetch(forecast)])
    .then(([respWeather, respForecast]) => {
      if (respWeather.ok && respForecast.ok) {
        return Promise.all([respWeather.json(), respForecast.json()])
      }
      throw new Error(respWeather.statusText, respForecast.statusText)
    })
    .then(json => {
      const weatherInfo = formatResponse(json)
      out.innerHTML = toHTML(weatherInfo)
    })
}

function formatResponse([weather, forecast]) {
  const currentTime = new Date().getTime()
  const parsed = {
    city: weather.name,
    time: getTime(currentTime, true),
    description: weather.weather[0].main,
    icon: weather.weather[0].icon,
    currentTemp: fromKelvinToCelcius(weather.main.temp),
    tempMax: fromKelvinToCelcius(weather.main.temp_max),
    tempMin: fromKelvinToCelcius(weather.main.temp_min),
    forecast: getParsedForecast(forecast.list)
  }
  return parsed
}

function getTime(timestamp, minutes) {
  if (minutes) {
    const date = new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: true, hour: 'numeric', minute: '2-digit'
    }).toLowerCase()
    return date
  }

  const date = new Date(timestamp * 1000).toLocaleString('en-US', {
    hour12: true, hour: 'numeric'
  }).split(' ').join('').toLowerCase()
  return date
}


function getParsedForecast(forecast) {
  let parsedForecast = []
  for (let i = 0; i < 5; i++) {
    const forecastHour = {
      time: getTime(forecast[i].dt),
      icon: forecast[i].weather[0].icon,
      currentTemp: fromKelvinToCelcius(forecast[i].main.temp)
    }
    parsedForecast.push(forecastHour)
  }
  return parsedForecast
}

function fromKelvinToCelcius(kTemp) {
  return (kTemp - 273.15).toFixed('0')
}

function toHTML(weatherInfo) {
  return `
    <div class="app">
      <header class="header">
        <h1 class="header__city">${weatherInfo.city}</h1>
        <div class="header__date">${weatherInfo.time}</div>
      </header>

      <main class="weather">
        <div class="weather__status">
          <img src="http://openweathermap.org/img/wn/${weatherInfo.icon}.png" alt="">
          <div>${weatherInfo.description}</div>
        </div>
        <div class="weather__temp">
          <div class="temp-current">${weatherInfo.currentTemp}°</div>
          <div class="temp-range">
            <div class="temp-high">max ${weatherInfo.tempMax}°C</div>
            <div class="temp-low">min ${weatherInfo.tempMin}°C</div>
          </div>
        </div>
      </main>

      <footer class="forecast">
        <div class="forecast-el">
          <div class="forecast-temp">${weatherInfo.forecast[0].currentTemp}</div>
          <img src="http://openweathermap.org/img/wn/${weatherInfo.forecast[0].icon}.png" alt="">
          <div class="forecast-date">${weatherInfo.forecast[0].time}</div>
        </div>
        <div class="forecast-el">
          <div class="forecast-temp">${weatherInfo.forecast[1].currentTemp}</div>
          <img src="http://openweathermap.org/img/wn/${weatherInfo.forecast[1].icon}.png" alt="">
          <div class="forecast-date">${weatherInfo.forecast[1].time}</div>
        </div>
        <div class="forecast-el">
          <div class="forecast-temp">${weatherInfo.forecast[2].currentTemp}</div>
          <img src="http://openweathermap.org/img/wn/${weatherInfo.forecast[2].icon}.png" alt="">
          <div class="forecast-date">${weatherInfo.forecast[2].time}</div>
        </div>
        <div class="forecast-el">
          <div class="forecast-temp">${weatherInfo.forecast[3].currentTemp}</div>
          <img src="http://openweathermap.org/img/wn/${weatherInfo.forecast[3].icon}.png" alt="">
          <div class="forecast-date">${weatherInfo.forecast[3].time}</div>
        </div>
        <div class="forecast-el">
          <div class="forecast-temp">${weatherInfo.forecast[4].currentTemp}</div>
          <img src="http://openweathermap.org/img/wn/${weatherInfo.forecast[4].icon}.png" alt="">
          <div class="forecast-date">${weatherInfo.forecast[4].time}</div>
        </div>
      </footer>
    </div>
  `
}
