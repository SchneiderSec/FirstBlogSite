var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const htmlJson = require('../models/htmlToJson');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
//Setup mongoose connection.
mongoose.connect('NOCREDSPLEASE', { useNewUrlParser: true, useUnifiedTopology: true})

router.get('/', function(req, res, next) {
  //htmlJson.justTest('Blog Test')
  htmlJson.submitPost();
  var data = htmlJson.getPosts(results => {
    res.render('home', {title: 'Welcome!', content: results[results.length - 1]});
  })
  
});

router.get('/about', function(req, res, next) {
  res.render('about', {title: 'Who am I?', contents: "Hello, my name is Chris Schneider. I am currently working as a Penetration Tester and love all things cyber-security! This blog is me documenting either things that I found interesting or am in the process of learning and wanted to share. The rare moments I have away from my computer are spent doing things like playing table tennis, fishing, gaming, or watching a new movie. If you have any questions or want to talk cyber security with somebody feel free to reach out to. <br><a href='test'><i class='fas fa-bug fa-3x'></i> <a href='test' class='hackerOne'>h1</a>"});
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {email: 'christopherschneidersec@gmail.com'});
});

router.get('/blog', function(req, res, next) {
  var data = htmlJson.getPosts(results =>{
    console.log(results);
    res.render('blog', {blogs: results})
  });
});


router.get('/blog/:post', (req, res)=>{ // Searches for the 'post' id and if it gets a result
  var searchParam = req.params.post.replace(/-/g, ' ');
  var post = htmlJson.getPost(searchParam, result =>{
    console.log(result);
    if (result.length === 0){
      res.render('404');
      return
    }
    res.render('post', {posting: result[0]}) //Renders the result to the page.
  })
})

router.get('/projects', function(req, res, next) {
  var content = "<h2>This site!</h2> To create this site I utilized the MERN (MongoDB, Express, React, and Node.js) stack. I learned a ton while doing so, if you are interested in creating your own website here are some of the resources I used in preparation: <a href='https://watchandcode.com/'> Watch and Code</a> and <a href='https://www.youtube.com/watch?v=w-7RQ46RgxU&list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp'>Net Ninja Node.js Tutorials</a>."
  res.render('projects', {title: 'Projects', contents: content});
});

router.get('/social', function(req, res, next) {
  res.render('social', {title: 'test'});
});

router.use((req,res)=>{
  res.status(400);
  res.render('404');
})

module.exports = router;
