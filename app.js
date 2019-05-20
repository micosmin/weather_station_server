const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('This is a test');
  mongoose.connect('mongodb://localhost/weather-data-test');
} else if (process.env.MONGODB_URI) {
  console.log('This is Heroku');
  mongoose.connect(process.env.MONGODB_URI);
} else {
  console.log('This is the development database');
  mongoose.connect('mongodb://localhost/weather-data-dev');
}

const WeatherRecord = require('./models/weatherDataModel');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/api/data', (req, res) => {
  WeatherRecord.find((err, weatherData) => {
    // if (err) {
    //   res.send({
    //     message: 'Record was not retrieved',
    //     mongoResponse: err,
    //   });
    // } else {
      res.send(weatherData);
    // }
  });
});

app.post('/api/data', (req, res) => {
  const weatherRecord = new WeatherRecord(req.body);
  weatherRecord.save((err) => {
    if (err) {
      res.send({
        message: 'Record was not saved',
        mongoResponse: err,
      });
    } else {
      res.send({
        message: 'Record saved',
        record: weatherRecord,
      });
    }
  });
});


app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;
