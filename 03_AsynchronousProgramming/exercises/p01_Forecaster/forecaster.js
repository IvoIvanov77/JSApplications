function attachEvents() {

    const LOCATION = $('#location');
    const SUBMIT_BTN = $('#submit');
    const CURRENT = $('#current');
    const UPCOMING = $('#upcoming');
    const LOCATION_URL = 'https://judgetests.firebaseio.com/locations.json';
    const TODAY_CONDITION_URL = 'https://judgetests.firebaseio.com/forecast/today/';
    const UPCOMING_CONDITION_URL = 'https://judgetests.firebaseio.com/forecast/upcoming/';
    const FORECAST = $('#forecast');
    const SYMBOLS = {
        'Sunny': '&#x2600',
        'Partly sunny': '&#x26C5',
        'Overcast':	'&#x2601',
        'Rain':	'&#x2614',
        'Degrees': '&#176'
    };

    SUBMIT_BTN.on('click', loadForecast);

    function loadForecast() {
        let locations = {};

        $.get(LOCATION_URL)
            .then(getLocations)
            .then(getForecast);

        function getLocations(res) {
            res.forEach(l => {
                locations[l.name] = l.code;
            })
        }

        function getForecast() {
            let location = LOCATION.val();
            let locationCode = locations[location];
            let today = $.get(TODAY_CONDITION_URL + locationCode + '.json');
            let upcoming = $.get(UPCOMING_CONDITION_URL + locationCode + '.json');

            Promise.all([today, upcoming]).then(displayForecast)
        }

        function displayForecast([todayCondition, upcoming]) {
            FORECAST.removeAttr('style');
            $('span').remove();

            renderCurrentCondition(todayCondition);

            upcoming.forecast.forEach(day => {
                renderUpcoming(day)
            })
        }
    }

    function renderCurrentCondition(todayCondition) {
        let forecast = todayCondition.forecast;
        let location = todayCondition.name;
        let currentCondition = forecast.condition;
        let currentConditionSymbol = getForecastItem(forecast).symbol;
        let currentTemperature = getForecastItem(forecast).temperature;
        CURRENT
            .append($('<span>').addClass('condition symbol').html(currentConditionSymbol))
            .append($('<span>').addClass('condition')
                .append($('<span>').addClass('forecast-data').text(location))
                .append($('<span>').addClass('forecast-data').html(currentTemperature))
                .append($('<span>').addClass('forecast-data').text(currentCondition)));
    }

    function renderUpcoming(day) {
        let dayConditionSymbol = getForecastItem(day).symbol;
        let dayTemperature = getForecastItem(day).temperature;
        UPCOMING
            .append($('<span>').addClass('upcoming')
                .append($('<span>').addClass('symbol').html(dayConditionSymbol))
                .append($('<span>').addClass('forecast-data').html(dayTemperature))
                .append($('<span>').addClass('forecast-data').text(day.condition)));
    }

    function getForecastItem(forecast) {
        return {
            temperature: `${forecast.low}&#176/${forecast.high}&#176`,
            symbol: SYMBOLS[forecast.condition]
        }
    }

}
