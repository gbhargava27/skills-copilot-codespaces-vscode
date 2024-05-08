// Create web server
// Import express module
const express = require('express');
// Create express server
const app = express();
// Import body-parser module
const bodyParser = require('body-parser');
// Import mongoose module
const mongoose = require('mongoose');
// Import comments model
const Comment = require('./models/comments');
// Import post model
const Post = require('./models/posts');
// Connect to MongoDB
mongoose.connect('mongodb://localhost/comments');

// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create new comment
app.post('/comments', (req, res) => {
  // Create new comment
  const newComment = new Comment({
    text: req.body.text,
    post: req.body.post
  });

  // Save new comment
  newComment.save((err, comment) => {
    if (err) {
      res.send('Error saving comment');
    } else {
      // Find post
      Post.findById(req.body.post, (err, post) => {
        if (err) {
          res.send('Post not found');
        } else {
          // Add new comment to post
          post.comments.push(comment);
          // Save post
          post.save((err) => {
            if (err) {
              res.send('Error saving post');
            } else {
              res.send(comment);
            }
          });
        }
      });
    }
  });
});

// Get comments
app.get('/comments', (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      res.send('Error getting comments');
    } else {
      res.send(comments);
    }
  });
});

// Get comments by post
app.get('/comments/:post', (req, res) => {
  Comment.find({ post: req.params.post }, (err, comments) => {
    if (err) {
      res.send('Error getting comments');
    } else {
      res.send(comments);
    }
  });
});

// Update comment
app.put('/comments/:id', (req, res) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) {
      res.send('Comment not found');
    } else {
      comment.text = req.body.text;
      comment.save((err, comment) => {
        if (err) {
          res.send('Error updating comment');
        } else {
          res.send