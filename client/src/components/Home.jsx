import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import WeatherIcon from "./WeatherIcon";
import { motion } from "framer-motion";

export default function Home() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [message, setMessage] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  //obtain location coordinates and weather info on mounting
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();

    async function fetchWeather(latitude, longitude) {
      try {
        const res = await fetch(
          `https://weather-app-rcwz.onrender.com/weather?location=${latitude},${longitude}`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const token = localStorage.getItem("token");

  //submitting form to update the city list
  async function handleAddCity() {
    try {
      const res = await fetch("https://weather-app-rcwz.onrender.com/city", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify({
          city: weatherData.name,
          coordinates: weatherData.coord,
        }),
      });

      if (res.ok) {
        setMessage("City successfully added to your cities");
      } else {
        setMessage("Couldn't add city");
      }
    } catch (err) {
      console.log(err);
      setMessage("An error occurred while adding the city");
    }
  }

  //for framer motion animation options
  const variants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.5,
    },
  };

  return (
    <div className="text-center text-2xl w-full h-screen z-10">
      <Navbar />
      <h1 className="font-bold text-white mt-4 md:mt-0 md:text-3xl mb-4 mx-4">
        What is the weather like today?
      </h1>
      <div className="h-12">
        {message && <p className="text-yellow-300">{message}</p>}
      </div>
      {weatherData ? (
        <motion.div initial="hidden" variants={variants} animate="visible">
          <span className="text-2xl">
            City: <strong>{weatherData.name}</strong>{" "}
            <button
              onClick={handleAddCity}
              className="bg-white px-1  mb-4 rounded-md hover:bg-blue-800 hover:text-white"
            >
              Add
            </button>
          </span>
          <div className="flex justify-center ">
            <WeatherIcon icon={weatherData.weather[0].icon} />
          </div>
          <p className="mt-4">Temperature:</p>
          <p className="text-yellow-300">{weatherData.main.temp} °C</p>
          <p>But it feels like:</p>
          <p className="text-yellow-300">{weatherData.main.feels_like} °C</p>
          <p>Wind is blowing at:</p>
          <p className="text-yellow-300">{weatherData.wind.speed} M/s</p>
        </motion.div>
      ) : (
        <p>Fetching Weather please wait...!</p>
      )}
      {showModal && <Modal setShowModal={setShowModal} />}
      <button
        className="bg-white px-2 py-1 m-3 mt-5 rounded-md hover:bg-blue-800 hover:text-white"
        onClick={() => setShowModal(true)}
      >
        Create Weather Alert
      </button>
    </div>
  );
}
