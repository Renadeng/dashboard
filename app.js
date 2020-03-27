// NPM
const express = require("express");
const ejs = require("ejs");
const https = require("https");

// App
const app = express();

// Set template engine
app.set("view engine", "ejs");

// Set up Mongoose
const mongoose = require("mongoose");

// Mongoose connect to MongoDB cloud server
mongoose.connect("mongodb+srv://renadeng:hanscq19@cluster0-bfu4d.mongodb.net/birthdayDB", { useNewUrlParser: true, useUnifiedTopology: true }, function(err){
  if(err) {
    console.log(err);
  } else {
    console.log("Successfuly connect to mangoDB.")
  }
});

// Setup database schema and model
const bdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  dateLunar: Date,
  dateSolar: {
    type: Date,
    required: true
  },
  age: Number,
  numOfDayToBD: Number
});
const Birthday = mongoose.model("Birthday", bdSchema);

let arr = [
  { name: "Rena2",
    city: "Waterloo",
    dateLunar: "1986-01-16",
    dateSolar: "1986-02-24",
    numOfDayToBD: 58
  },
  { name: "Tim2",
    dateSolar: "1979-10-30",
    city: "Waterloo",
    numOfDayToBD: 25
  },
  { name: "Sofia2",
    dateSolar: "2020-02-18",
    city: "Waterloo",
    numOfDayToBD: 14
  }
];

// Birthday.insertMany(arr, function(err, birthdays){
//   if(err) {
//     console.log(err);
//   }
// });

// const bdRena = new Birthday({
//   name: "Rena",
//   calendarType: "Lunar",
//   date: 1986-01-16
// });

// bdRena.save(function(err, bdRena){
//   if(err) {
//     console.log(err);
//   }
// });
//
// Birthday.deleteOne({name: "Rena"}, function(err){
//   if(err) {
//     console.log(err);
//   }
// });


// Birthday.find({}, function(err, birthdays){
//     if(!err) {
//       console.log(birthdays);
//     }
// });

// Find the coming birthdays

Birthday.aggregate([
  {
    $match: {numOfDayToBD: {$lt: 31}}
  },
  {
    $sort: {numOfDayToBD: 1}
  }
], function(err, results){
  if(err) {
    console.log(err);
  } else {
    results.forEach(function(result){
      console.log(result.name + "'s birthday is coming in " + result.numOfDayToBD + " days!");
    });
  }
});

// Birthday section

// app.post("/birthday", function(req, res){
//   Birthday.findOne({name: "Tim" }, function(err, birthday){
//     if(err) {
//       console.log(err);
//     } else {
//       res.send({tDate: birthday.date});
//     }
//   });
// });

app.get("/", function(req, res) {
  // Get weather information from https://openweathermap.org/
  const cityName = "waterloo";
  const apiKey = "8605ff0377fd429e4ec970da7c088d56";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=metric";
  https.get(url, function(response){
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = Math.floor(weatherData.main.temp);
        const des = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        // Render info to starting page
        res.render("index", {temp: temp, des: des, icon: icon});
      });
    });
});





// Setup server
app.listen("3000", function() {
  console.log("Server is connected.");
});
