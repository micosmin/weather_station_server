const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

if (process.env.ENV === 'Test') {
  console.log('This is a test');
  mongoose.connect('mongodb://localhost/weather-data-test');
} else {
  console.log('This is 4 real');
  mongoose.connect('mongodb://localhost/weather-data-dev');
}

const WeatherRecord = require('./models/weatherDataModel');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from PlaceHolder. Deployed to Heroku from Travis. After a pull request.');
});

app.post('/api/data', (req, res) => {
  const weatherRecord = new WeatherRecord(req.body);
  weatherRecord.save((err) => {
    if (err) {
      // console.log(err.errors);
      res.send({
        message: 'Record was not saved',
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
