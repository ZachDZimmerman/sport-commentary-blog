var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(request, response, next) {
  Promise.all([
    knex("post").select()
      .leftJoin("users", function () {
        this.on("users.id", "=", "post.users_id")
      })
      // .join("post", function () {
      //   this.on("post.id", "=", "comment.post_id")
      // })
    ]).then(function (data) {
    console.log(data)
    response.render('index', {post: data[0]});
  })
  .catch(function (error) {
    console.error(error)
    next(error)
  })
});

router.get('/create', function (req, res, next) {
  res.render('create')
})

router.get('/:id/edit', function (req, res, next) {
  knex('post').where({id:req.params.id}).first().then(function (post) {
      res.render('edit', {post: post})
  })
})

router.post('/:id/edit', function (req, res, next) {
  knex('post').where({id:
  req.params.id}).update(req.body).then(function() {
    res.redirect('/' + req.params.id)
  })
})

router.get('/:id/delete', function (req, res, next) {
  knex('post').where({id:
  req.params.id}).del().then(function () {
    res.redirect('/')
  })
})

router.get('/:id', function (req,res,next) {
  knex('post').where({id:
  req.params.id}).first().then(function (post) {
    res.render('detail', {post:post})
  })
});

router.post('/create', function (req,res,next) {
  knex('users').insert({name: req.body.name}, 'id').then(function (id) {
    var post = {
        blog: req.body.blog,
        image: req.body.image,
        name: req.body.name,
        users_id: id[0]
    }
    knex('post').insert(post).then(function () {
      res.redirect('/');
    })
  }).catch(function (err) {
    console.log(err);
    next(err)
  })
})

module.exports = router;
