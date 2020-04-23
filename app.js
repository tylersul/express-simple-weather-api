// ================================================================== //
// ====================== Variable Instantiation ==================== //
// ================================================================== //
const express = require("express"),
      app     = express(),
      https   = require("https"),
      bodyParser = require("body-parser");

// ================================================================== //
// ====================== Middleware ================================ //
// ================================================================== //
app.use(bodyParser.urlencoded({extended:true}));


// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    console.log(req.body.city)

    const query = req.body.city;
    const units = "imperial";
    const key   = "f34f7bccef5ecd9dfd124678476efe07"

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + key;


    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData        = JSON.parse(data);                        // Parse data returned from API call to JSON format
            const temp               = weatherData.main.temp;                   // Pull temperature from "main" subsection of weatherData
            const weatherDescription = weatherData.weather[0].description;      // Access first object of Weather Array and pull description
            const icon               = weatherData.weather[0].icon;                // Access first object of Weather array and pull weather icon
            const weatherIconURL     = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p> The weather is currently: " + weatherDescription + ".");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees.<h1>");
            res.write("<img src=" + weatherIconURL +">");
            res.send();
        });
    });
})


// ================================================================== //
// ====================== Listeners ================================= //
// ================================================================== //
app.listen(3000, function(){
    console.log("Service is running on Port 3000.");
});


/* Example API Response 

{
  coord: { lon: -87.65, lat: 41.85 },
  weather: [
    {
      id: 804,
      main: 'Clouds',
      description: 'overcast clouds',
      icon: '04d'
    }
  ],
  base: 'stations',
  main: {
    temp: 284.84,
    feels_like: 282.09,
    temp_min: 282.59,
    temp_max: 286.48,
    pressure: 1007,
    humidity: 71
  },
  visibility: 16093,
  wind: { speed: 2.8, deg: 53 },
  clouds: { all: 90 },
  dt: 1587656377,
  sys: {
    type: 1,
    id: 4861,
    country: 'US',
    sunrise: 1587639427,
    sunset: 1587688809
  },
  timezone: -18000,
  id: 4887398,
  name: 'Chicago',
  cod: 200
}

*/