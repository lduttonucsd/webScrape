// many package much install and require
var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
const exphbs = require("express-handlebars");
var mongojs = require("mongojs");

var app = express();
const PORT = process.env.PORT || 3000;


// handlebars stuffs
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");
require("./routes/htmlRoutes")(app);



// setting up scrape db model
var databaseUrl = "newsScrape";
var collections = ["articles"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error:", error);
});





// the esports observer scrape
axios.get("https://esportsobserver.com/").then(function (response) {
    let $ = cheerio.load(response.data);

    let scrapeResults = [];
    $("a.thumb-zoom").each(function (i, element) {
        var title = $(element).children().attr("title");
        var link = $(element).attr("href");
        var img = $(element).children("img").attr("src");

        scrapeResults.push({
            title: title,
            link: link,
            img: img
        });

    });
    // console.table(scrapeResults);
});


// the esportsinsider scrape  
axios.get("https://esportsinsider.com/").then(function (response) {
    let $ = cheerio.load(response.data);

    let scrapeResults = [];
    $("div.td-module-thumb").each(function (i, element) {
        var title = $(element).children().attr("title");
        var link = $(element).children("a").attr("href");

        scrapeResults.push({
            title: title,
            link: link
        });

    });
    scrapeResults.slice(0, 9);
    console.table(scrapeResults);
});








module.exports = app;

app.listen(3000, function () {
    console.log("App running on port 3000!");
});