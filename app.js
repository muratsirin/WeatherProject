require("dotenv").config();
const express = require("express");
const https = require("https");
const { parse } = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const city = req.body.city;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;
  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temparature = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const weatherImg = weatherData.weather[0].icon;
      const weatherImgURL =
        "http://openweathermap.org/img/wn/" + weatherImg + "@2x.png";

      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write(
        "<h1> The temparature in " +
          city +
          " is " +
          temparature +
          " degress celcius. </h1>"
      );
      res.write("<img src=" + weatherImgURL + ">");
      res.send();
    });
    console.log(response);
  });
});

app.listen(3000, function () {
  console.log("Server is running opn port 3000");
});
