const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
let db = require("./models");


// mongoose.connect(MONGODB_URI);

// Initialize Express
const app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

const PORT = process.env.PORT || "localhost:8080";
// Connect to the Mongo DB
const Mongo_URL=process.env.MONGODB_URI ||"mongodb://localhost/scraped";
mongoose.connect(MONGODB_URL, { useNewUrlParser: true });


app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.theonion.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      let $ = cheerio.load(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h4").each(function(i, element) {

        // Save an empty result object
        let result = {};

        result.title = $(this).text()
        
        // Add the text and href of every link, and save them as properties of the result object
        result.description = $(this)
          .next("p")
          .text();

        result.link = $(this)
          .parent("a")
          .attr("href");

          console.log(result); 

        // Create a new Article using the `result` object built from scraping

        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  // Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    .populate("comments")
      .then(function(dbArticle) {
        // If any Books are found, send them to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({_id: req.params.id })
    .populate("comments")
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    })
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
   db.Comment.create(req.body)
    .then(function(dbComment){
      return db.Article.findOneAndUpdate({_id:req.params.id}, { comments: dbComment._id}, {new: true});
    })
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err)
    });
  });
  

    // Route for deleting a comment on an Article by id,
    app.delete("/articles/:id", function(req, res) {
      const { commentId } = req.body;
      console.log("MY INFORMATION: ", req.params.id, commentId);
      
    });
    

  
app.get('/', (req, res) => res.sendFile(__dirname + "/views/index.html"));

  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  




  /**
   *   
    const divArray = $(this)
    .children("div");

    const lastDiv = divArray[divArray.length - 1];

    console.log("LAST DIVS: ", lastDiv);
   */

  // The Onion Structure

          /**
         * <article>
         *  <div>
         *    <a>
         *      <img src="blar..." />
         *    </a>
         *  </div>
         * 
         *  <div>
         *    <a>
         *       <h4></h4>
         *       <p></p>
         *    </a>
         *  </div>
         * </article>
         * 
         * <article>
         *  <div>
         *    <a>
         *       <h4></h4>
         *       <p></p>
         *    </a>
         *  </div>
         * </article>
         */



        // db.Article.findOne({_id: req.params.id })
        // .then(function(dbArticle){
        //   console.log("article to handle!: ", dbArticle);
        //   dbArticle.comments.pull(commentId);
        //   dbArticle.save();
        // })