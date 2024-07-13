import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';
import ReactAnimatedWeather from 'react-animated-weather';

const defaults = {
    icon: 'WIND',
    color: 'skyblue',
    size: 30,
    animate: true
};

const Weather = () => {
    const [city, setCity] = useState('Tokyo'); // Default city
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiKey = process.env.REACT_APP_API_KEY;

    const handleSearch = async (event) => {
        if (event) {
            event.preventDefault();
        }
        if (!apiKey) {
            setError('Please set your API key in the .env file (or your secure environment variable storage).');
            return;
        }
        if (!city) {
            setError('Please enter a city name.');
            return;
        }
        setLoading(true);

        try {
            const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            setWeatherData(weatherResponse.data);
            const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
            setForecastData(forecastResponse.data);
            setError(null);
        } catch (error) {
            setError('Error fetching weather data. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Perform initial search for the default city when the component mounts
        handleSearch();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleOnChange = (event) => {
        setCity(event.target.value);
    };

    const getLocalTime = (timezone) => {
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        const localTime = new Date(utcTime + 1000 * timezone);
        return localTime;
    };

    const renderForecast = () => {
        if (!forecastData) {
            return null;
        }

        // Group forecast data by day and take the first forecast of each day
        const dailyForecasts = forecastData.list.reduce((acc, forecast) => {
            const date = forecast.dt_txt.split(' ')[0];
            if (!acc[date]) {
                acc[date] = forecast;
            }
            return acc;
        }, {});
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return (

            <div className="forecast">
                {Object.keys(dailyForecasts).slice(0, 5).map((date) => {
                    const forecast = dailyForecasts[date];
                    const dayName = daysOfWeek[new Date(date).getDay()];
                    return (
                        <div key={date} className="forecast-day">
                            <h3>{dayName}</h3>
                            <img
                                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                alt={forecast.weather[0].main}
                                className="forecast-icon"
                            />
                            <p>{(forecast.main.temp - 273.15).toFixed(2)}°C</p>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <main className="main">
            <div className="weather-app">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={city}
                        onChange={handleOnChange}
                        placeholder="Enter city name"
                        className="search-input"
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSearch(event);
                            }
                        }}
                    />
                    <button type="submit" className="btn">GO</button>
                </form>
                {loading && <div className="loading">Loading...</div>}
                {error && <p className="error-message">{error}</p>}
                {weatherData && !loading && (
                    <div className="weather">
                        <div className="weather-details">
                            <h2>{weatherData.name}</h2>
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt={weatherData.weather[0].main}
                                className="weather-icon"
                            />
                            <p className='text-1'>{(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
                            <p className='text-2 '>{weatherData.weather[0].description}</p>
                            <p>
                                <ReactAnimatedWeather
                                    icon={defaults.icon}
                                    color={defaults.color}
                                    size={defaults.size}
                                    animate={defaults.animate}
                                    className="icon"
                                /> {weatherData.wind.speed} m/s
                            </p>
                            <p className='text-3'>Humidity: {weatherData.main.humidity}%</p>
                            <p className='text-3'>
                                Local Time: {getLocalTime(weatherData.timezone).toLocaleString()}
                            </p>
                            <h3 className='forecast-heading'>5 Days Forecast:</h3>
                        </div>
                        {renderForecast()}
                    </div>

                )}
            </div>
        </main>
    );
};

export default Weather;
