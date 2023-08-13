const API_KEY = "f640c9e11525f5b0f824fa93b0467545";
const baseUrl = "https://api.openweathermap.org/data/2.5";

const uniqueCities = new Set();


const searchInput = document.querySelector('.search-input');
const formElement = document.querySelector('.search-form');
const container = document.querySelector('.allCityWeatherDataContainer');
let citiesWeatherData = [];

formElement.addEventListener('submit', addCity);

function addCity(e) {

    console.log(e);
    e.preventDefault();

    const currentCity = searchInput.value.trim();
    if (currentCity === "") {
        alert("Enter a city name");
        return;
    }

    if (uniqueCities.has(currentCity)) {
        alert(`City ${currentCity} already exists!`)
        return;
    }

    uniqueCities.add(currentCity);

    getSearchResults(currentCity);

    searchInput.value = '';
}

/**
 * 
 * @param {*} citiesWeatherData  Arary<{ temp, high, low, name, country, condition, img }>
 */
function render(citiesWeatherData) {
    // Clear all the existing weather cards
    container.innerHTML = null;

    for (const data of citiesWeatherData) {

        const city = document.createElement('div');
        city.className = "cityWeatherData";

        city.innerHTML = `
                <div class="wrapper-1">
                </div>
                <div class="wrapper-2">
                    <div class="section1">
                        <div class="stats">
                            <div class="instantTemperature">
                                <b>${Math.floor(data.temp)}&deg;</b>
                            </div>
                            <div class="temprange">
                            ${Math.floor(data.temp_max)}&deg; L:${Math.floor(data.temp_min)}&deg;
                            </div>
                        </div>
                        <div class="image">
                            <img src="${data.img}" alt="">
                        </div>
                    </div>
                    <div class="section2">
                        <div class="cityName">
                        ${data.name}, ${data.country}
                        </div>
                        <div class="weatherCondition">
                        ${data.condition}
                        </div>
                    </div> 
                </div>
    `;

        container.appendChild(city);
    }


}

async function getSearchResults(CITY_NAME) {
    let url = `${baseUrl}/weather?q=${CITY_NAME}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url, { method: "GET" });
    const result = await response.json();


    if (result.cod === '404') {
        alert(`City ${CITY_NAME} doesn't exist!`)
        return;
    }

    const cityWeatherData = {
        temp: result.main.temp,
        temp_min: result.main.temp_min,
        temp_max: result.main.temp_max,
        name: result.name,
        country: result.sys.country,
        condition: result.weather?.[0]?.main,
        img: `https://openweathermap.org/img/wn/${result.weather?.[0]?.icon}@2x.png`
    }

    citiesWeatherData.push(cityWeatherData);
    // sort the cities weather data by temperature

    citiesWeatherData.sort((a, b) => (a.temp - b.temp))

    render(citiesWeatherData);
}



