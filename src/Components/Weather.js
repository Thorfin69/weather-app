import React, { useState, useEffect } from 'react';

import axios from 'axios';
import './Weather.css';
import { Thermometer } from 'lucide-react';



const Weather = () => {
    // State variables
    const [city, setCity] = useState(''); // User-entered city name
    const [weatherData, setWeatherData] = useState(null); // Weather data from API
    const [error, setError] = useState(null); // Error message (if any)

    // users current locaion




    // API key (replace with your actual API key from a secure environment variable)
    const apiKey = process.env.REACT_APP_API_KEY;

    // Form submission handler
    const handleSearch = async (event) => {
        if (event) {
            event.preventDefault(); // Prevent default form submission behavior
        }
        if (!apiKey) {
            setError('Please set your API key in the .env file (or your secure environment variable storage).');
            return;
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
            );
            setWeatherData(response.data);
            setError(null); // Clear any previous error
        } catch (error) {
            setError('Error fetching weather data. Please try again later.');
            console.error(error); // Log the error for debugging
        }
    };

    // Fetch weather data when city changes or on initial render
    useEffect(() => {

        if (city) {
            handleSearch();
        }

    }, [city]);

    // Component rendering with detailed structure and styling suggestions
    return (

        <main className="main">
            <div className="weather-app">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder=" Enter city name"
                        className="city-input"
                    />

                </form>

                {weatherData && ( // Display weather data if available
                    <div className="weather">
                        <div className="weather-details">
                            <h2>{weatherData.name}</h2>
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt={weatherData.weather[0].main}
                                className="weather-icon"
                            />
                            <p>Temprature: {(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
                            <p>Description: {weatherData.weather[0].main}</p>
                            <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                            <p>Humidity: {weatherData.main.humidity}%</p>


                        </div>
                    </div>
                )}


            </div>
        </main>
    );
};

export default Weather;
