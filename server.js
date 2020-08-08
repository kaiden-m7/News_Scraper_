var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
const { response } = require("express");

var PORT = 3000;

var app = express();


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; 

mongoose.connect(MONGODB_URI);

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.get("/scrape", function(req, res){
    axios.get("https://www.bbc.com/news/").then(function(response){
        let $ = cheerio.load(response.data);

        $("article h3").each(function(i, element) {
            let result = {};

            result.title = $(this)
                .children('a')
                .text();
            result.link = $(this)
                .children('a')
                .attr('href');

            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err){
                    console.log(err);
                });
        });

        res.send("Scrape Finished");
    });
});

app.get("/articles", function(req, res) {
    
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
  });