var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
const { response } = require("express");

var PORT = 3000;

var app = express();

//connection to db

mongoose.connect('mongodb://localhost/news-scraper')
mongoose.Promise = global.Promise;


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//GET route using axios to scrape BBC news site
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

//getting all upated news from site through DB
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//user search for article 
app.get("/articles/:id", function(req, res) {
    
    db.Article.findOne({ _id: req.params.id })
      
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  //POST route for articles to save and update daily 
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
       
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
//connection to server 
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
  });