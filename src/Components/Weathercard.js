import React from 'react'
import './/Weather.css'
export const Weathercard = (props, children) => {
    return (
        <div className="card">
            <h1>{props.cityName}</h1>
            <p>{props.temprature}°C</p>
            <p>{props.details}</p>
            <p>{props.windSpeed}m/s</p>
            <p>{props.humidity}%</p>

        </div>
    )
}
