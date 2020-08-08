var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });