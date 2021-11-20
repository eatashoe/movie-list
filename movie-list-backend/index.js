const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require('path')

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const moviesRouter = require("./routes/movies");
app.use("/movies", moviesRouter);


app.listen(port, function() {
    console.log("Runnning on " + port);
  });

module.exports = app;

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../my-movie-list/public')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../my-movie-list/public/index.html'))
})