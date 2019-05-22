//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const app = express();

//setting up EJS
app.set('view engine', 'ejs');

//setting up BodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

//setting up Express
app.use(express.static("public"));

//setting up Mongoose
mongoose.connect('mongodb+srv://admin-Alan:test123@cluster0-8xpvz.mongodb.net/todolistDB', {
  useNewUrlParser: true
});

//Posts schema
const postsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

//creating MongoDb model that follows Posts schema.
const Post = mongoose.model("Post", postsSchema);

//default content when the new DB is created.
const homeStartingContent = new Post({
  title: "Place holder",
  content: "This section of text is just a place holder. It is created when the jornal is completely empty of any entries."
});

//root page that uses the home.ejs template
app.get('/', function(req, res) {
  Post.find({}, function(err, results) {
    if (!err) {
      if (results.length === 0) {
        homeStartingContent.save();
        res.redirect('/');
      } else {
        res.render("home", {
          posts: results
        });
      }
    }
  })
});

//about page
app.get('/about', function(req, res) {
  res.render("about");
});

//expanded view of posts that contain more than 100 characters.
app.get('/post/:postEntry', function(req, res) {
  Post.findOne({
    _id: req.params.postEntry
  }, function(err, result) {
    if (!err && result) {
      res.render("post", result);
    }
  });
});

//journal entry compose page.
app.get('/compose', function(req, res) {
  res.render("compose");
});

//saving journal entry and displaying it on the home page.
app.post('/compose', function(req, res) {
  let newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postMessage
  });
  newPost.save();
  res.redirect("/");
});

//configuring the listening port.
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
