var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(request, response, next) {
  Promise.all([
    knex("post").select()
      .join("users", function () {
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
  knex('post').where({id:req.params.id}).then(function (post) {
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
  knex('users').where({id:
  req.params.id}).del().then(function () {
    res.redirect('/')
  })
})

router.get('/:id', function (req,res,next) {
  knex('users').where({id:
  req.params.id}).then(function (users) {
    res.render('detail', {users:users})
  })
});

router.post('/create', function (req,res,next) {
  knex("post").insert(req.body).then(function () {
    res.redirect('/');
  }).catch(function (err) {
    console.log(err);
    next(err)
  })
})

module.exports = router;
