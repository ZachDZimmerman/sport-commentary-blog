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
    // console.log(data)
    response.render('index', {post: data[0]});
  })
  .catch(function (error) {
    console.error(error)
    next(error)
  })
});

router.get('/create', function (req, res, next) {
  knex('users').select
  res.render('create')
})

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

router.get('/:id/edit', function (req, res, next) {
  knex('post').where({id:req.params.id}).first().then(function (post) {
    // console.log(post);
      res.render('edit', {post: post})
  })
})

router.post('/:id/edit', function (req, res, next) {
  knex('post').where({id:
  req.params.id}).update(req.body).then(function() {
    res.redirect('/' + req.params.id)
  })
})

router.get('/:postid/:commentid/delete', function (req, res, next) {
  knex('comment').where({id: req.params.commentid}).del()
  .then(function () {
    res.redirect('/' + req.params.postid)
    })
});

router.get('/:id/delete', function (req, res, next) {
  knex('comment').where({post_id: req.params.id}).del()
  .then(function () {
  knex('post').where({id: req.params.id}).del()
  .then(function () {
    res.redirect('/')
    })
  })
});

router.get('/:id', function (req,res,next) {
  Promise.all([
    knex('post').where({id:
    req.params.id}).first(),
    knex('comment').select().where({'post_id': req.params.id})
  ]).then(function (data) {
    // console.log(data);
      res.render('detail', {post:data[0], comments: data[1]})
    })
});

router.post('/:id', function (req, res, next) {
  // console.log(req.body);
  knex('users').select().where({'users.name': req.body.name}).first()
  .then(function (users) {
    if (users) {
      return [users]
    } else {
      return knex('users').insert({name:req.body.name}).returning('*')
    }
  })
  .then(function (users) {
    // console.log(users, "USERS");
    var comment = {
      users_id: users[0].id,
      post_id: req.params.id,
      comment: req.body.comment
    }
    // console.log(req.body.comment);
    return knex('comment').insert(comment)
  })
  .then(function () {
    res.redirect('/' + req.params.id)
  })
});


module.exports = router;
