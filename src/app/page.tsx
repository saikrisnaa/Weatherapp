"use client";
import { useEffect, useState } from "react";
import style from './page.module.css';
function getCurrentDate(){
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const date = new Date().getDate() + " - " + monthName;
  return date;
}

export default function Home() {
  const date=getCurrentDate();
  const[weatherData,setWeatherData]=useState<any>(null);
  const [area, setArea] = useState("hyderabad");
  async function fetchData(areaName:string) {
    try {
      const response= await fetch("http://localhost:3000/api/weather?address=" + areaName);
      const jsData = (await response.json()).data;
      setWeatherData(jsData);
    } catch (error) {
      console.log(error);
    }
    
  }

  async function fetchDataByCoordinates(latitude:number, longitude:number) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  return ( 
  <main className={style.main}> 
  <article className={style.widget}>
  <form
          className={style.weatherLocation}
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(area);
          }}
        >
          <input
            className={style.input_field}
            placeholder="Enter Area"
            type="text"
            id="cityName"
            name="cityName"
            onChange={(e) => setArea(e.target.value)}
          />
          <button className={style.search_button} type="submit">
            Seach
            </button>
            </form>
  {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className={style.icon_and_weatherInfo}>
              <div className={style.weatherIcon}>
                {weatherData?.weather[0]?.description === "rain" ||
                weatherData?.weather[0]?.description === "fog" ? (
                  <i
                    className={`wi wi-day-${weatherData?.weather[0]?.description}`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy"></i>
                )}
              </div>
              <div className={style.weatherInfo}>
                <div className={style.temperature}>
                  <span>
                    {(weatherData?.main?.temp - 273.5).toFixed(2) +
                      String.fromCharCode(176)}
                  </span>
                </div>
                <div className={style.weatherCondition}>
                  {weatherData?.weather[0]?.description?.toUpperCase()}
                </div>
              </div>
            </div>
            <div className={style.place}>{weatherData?.name}</div>
            <div className={style.date}>{date}</div>
          </>
        ) : (
          <div className={style.placee}>Gathering clouds of information... ☁️</div>
        )}
      </article>
  </main>
  );
}
