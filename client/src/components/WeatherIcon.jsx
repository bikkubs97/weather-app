import {
  FaSun,
  FaCloud,
  FaCloudSun,
  FaCloudRain,
  FaMoon,
  FaCloudMoon,
} from "react-icons/fa";

export default function WeatherIcon({icon}) {

  switch (icon) {
    case "01d":
      return (
        <>
          <FaSun />
          <br />
          <span className="m-2"> It's a beautiful Sunny Day!!</span>
        </>
      );
    case "01n":
      return (
        <>
          <FaMoon />
          <br />
          <span> Starry Night!!</span>
        </>
      );
    case "02d":
      return (
        <>
          <FaCloudSun />
          <br />
          <span> Overcast</span>
        </>
      );
    case "02n":
      return (
        <>
          <FaCloudMoon />
          <br />
          <span>Cloudy Night</span>
        </>
      );
    case "03d":
    case "03n":
      return (
        <>
          <FaCloud />
          <br />
          <span> Scattered Clouds</span>
        </>
      );
    case "04d":
    case "04n":
      return (
        <>
          <FaCloud />
          <br />
          <span> Broken Clouds</span>
        </>
      );
    case "09d":
    case "09n":
      return (
        <>
          <FaCloudRain />
          <br />
          <span> It Rains!!</span>
        </>
      );
    case "10d":
    case "10n":
      return (
        <>
          <FaCloudRain />
          <br />
          <span> Sprinkles! Light Rain</span>
        </>
      );
    case "11d":
    case "11n":
      return (
        <>
          <FaBolt />
          <br />
          <span> Thunderstorms!!</span>
        </>
      );
    case "13d":
    case "13n":
      return (
        <>
          <FaCloud />
          <br />
          <span> Snowy</span>
        </>
      );
    case "50d":
    case "50n":
      return (
        <>
          <FaCloud />
          <br />
          <span> Misty</span>
        </>
      );
    default:
      return (
        <>
          <FaSun />
          <br />
        </>
      );
  }
}
