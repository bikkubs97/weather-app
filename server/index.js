import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import { User } from "./model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import nodemailer from "nodemailer";

const app = express();

if (process.env.NODE_ENV !== "production") {
  config();
}
app.use(cors());
app.use(express.json());

//conncting ot database
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
  console.log("connected to mongoose!!");
});

//Route for corn job , to keep the free server awake

app.get("/", (req, res) => {
  res.send("Server is live");
});

//get weather route

app.get("/weather", async (req, res) => {
  try {
    // Get location value from URL
    const { location } = req.query;

    if (!location) {
      res.status(400).send("Location parameter is required");
      return;
    }

    // Define API request parameters
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    const apiKey = process.env.API_KEY;

    const [latitude, longitude] = location.split(",");

    const params = new URLSearchParams({
      lat: latitude,
      lon: longitude,
      appid: apiKey,
      units: "metric",
    });

    // Make API request using Fetch
    const response = await fetch(`${apiUrl}?${params}`);

    if (!response.ok) {
      console.log(response);
    }
    const weatherData = await response.json();
    res.json(weatherData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting weather data");
  }
});

//create account route

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email_Id: req.body.email_Id,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
  }
});

//login route

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email_Id: req.body.email_Id });
    console.log(req.body);
    if (!user) {
      return res.status(400).send("can not find user");
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ user: user }, process.env.JWT_SECRET);
      res.status(202).json({ token });
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});



app.put("/city", verifyToken, async function (req, res) {
  try {
    const newCity = req.body.city; // Extract new city data from the request body
    const coordinates = {
      latitude: req.body.coordinates.lat,
      longitude: req.body.coordinates.lon,
    }; // Extract coordinates from the request body

    // Find the user document by email
    const user = await User.findById(req.user.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the city already exists in the user's cities array
    const existingCity = user.cities.find(city => city.name === newCity);
    if (existingCity) {
      return res.status(400).json({ error: "City already added" });
    }

    // Add the new city to the cities array with proper coordinates
    user.cities.push({ name: newCity, coordinates });

    // Save the updated document
    const updatedUser = await user.save();

    // Send the updated document as the response
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


//route for updating the emails for the user
app.put("/emails", verifyToken, async (req, res) => {
  try {
    const { email1, email2, email3 } = req.body; // Extract new email data from the request body
    // Find the user document by its _id
    const user = await User.findById(req.user.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } // Push the new emails to the emails array
    user.emails.push(email1, email2, email3);
    // Save the updated document
    const updatedUser = await user.save();
    // Send the updated document as the response
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//scheduling corn to send emails at 12pm everyday except on sundays
cron.schedule(
  "26 23 * * 1-6",
  async () => {
    try {
      const usersWithEmails = await User.find({
        emails: {
          $exists: true, // Check if the emails field exists
          $ne: [], // Check if the emails field is not an empty array
        },
      });

      for (const user of usersWithEmails) {
        const cityWeatherPromises = user.cities.map(async (city) => {
          try {
            // Fetch weather data for the city
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${process.env.API_KEY}&units=metric`;
            const response = await fetch(apiUrl);
            const weatherData = await response.json();
            return { cityName: city.name, weather: weatherData };
          } catch (error) {
            console.error(
              `Error fetching weather data for ${city.name}:`,
              error
            );
            return { cityName: city.name, weather: null };
          }
        });

        const cityWeathers = await Promise.all(cityWeatherPromises);

        // Format weather data
        const formattedWeatherData = cityWeathers.map(
          ({ cityName, weather }) => {
            if (!weather) {
              return `${cityName}: Error fetching weather data`;
            } else {
              const temperature = weather.main.temp;
              const description = weather.weather[0].description;
              return `${cityName}:  Weather: ${description},Temperature: ${temperature}°C,`;
            }
          }
        );

        // Send email with formatted weather data to the email addresses listed in user's email array
        sendEmail(user.emails, formattedWeatherData);
      }

      console.log("Task executed at 12:00 PM");
    } catch (error) {
      console.log(error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

//send email funciton

async function sendEmail(emails, cities) {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "granville.torphy@ethereal.email",
        pass: "AtNR1w2DdFApNrm45W",
      },
    });

    //email content
    const mailOptions = {
      from: "admin@todaysweather.com",
      to: emails.join(","), 
      subject: "Todyas Weather info",
      text: `Your cities and weather: ${cities.join(", ")}`, 
    };

    console.log("Email contents:", mailOptions); 

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

//middile ware for authentication
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); 
    req.user = decoded; // Store the decoded token data in req.user
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.listen(3000, () => {
  console.log("app is listening at 3000");
});
