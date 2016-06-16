var express = require('express');
var router = express.Router();
var blog = require('../db/api');

router.get('/', function(req, res, next) {
  blog.get().then(function(blog) {
    res.render('index', {blog: blog });
  })
});

router.get('/add', function (req, res, next) {
  res.render('show');
})

router.post('/', function (req, res, next) {
  blog.insert(req.body).then(function () {
    res.redirect('/')
  })
})

router.post('/delete', function (req, res, next) {
  blog.delete(req.body.id).then(function () {
    res.redirect('/')
  })
})

module.exports = router;
