const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// app.get("/articles", function(req, res){
//     Article.find({}, function (err, foundArticles){
//         if(err)
//         {
//             res.send(err);
//         }
//         else
//         {
//             res.send(foundArticles);
//         }
//     });
// });

// app.post("/articles", function(req, res){
//     console.log(req.body.title);
//     console.log(req.body.content);

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save(function(err){

//         if(err)
//         {
//             res.send(err);
//         }
//         else
//         {
//             res.send("Successfully posted !!");
//         }

//     });
// });

// app.delete("/articles", function(req, res){
//     Article.deleteMany(function(err){
//         if(err)
//         {
//             res.send(err);
//         }
//         else
//         {
//             res.send("Successfully deleted all !!");
//         }
//     })
// });

////////////////////////////////////////Routing all articles//////////////////////////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully posted !!");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all !!");
      }
    });
  });

//////////////////////////////Routing specific article///////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article was found with this matching title !!");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated article using put.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article using patch.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.findOneAndDelete(
      { title: req.params.articleTitle },
      function (err) {
        if (!err) {
          res.send("Successfully deleted the article.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(5000, function (req, res) {
  console.log("Server started at port 5000");
});
